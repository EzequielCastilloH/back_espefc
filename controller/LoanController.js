const Loan = require('../model/Loan');
const User = require('../model/User');
const Customer = require('../model/Customer');
const transporter = require('../utils/mailer');
const { decrypt } = require('../utils/encription');

async function createLoan(req, res) {
    try {
        const {
            user_id,
            loan_type,
            loan_amount,
            loan_deadline,
            loan_amortization_type,
            loan_pending_amount,
            loan_guarantors,
        } = req.body;

        const customer = await Customer.findOne({ where: { customer_id: user_id } });
        const loan_customer_name = customer.customer_name;
        await Loan.create({
            user_id,
            loan_num: '',
            loan_customer_name,
            loan_type,
            loan_amount,
            loan_deadline,
            loan_amortization_type,
            loan_pending_amount,
            loan_guarantors,
        });

        res.status(201).json({ message: 'Loan guardado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar el Loan' });
    }
}

async function getLoans(req, res) {
    try {
        const loans = await Loan.findAll();
        res.status(200).json({ success: true, loans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener los Loans' });
    }
}

async function getLoansByUser(req, res) {
    try {
        const { user_id } = req.body;
        const loans = await Loan.findAll({ where: { user_id: user_id } });
        res.status(200).json({ success: true, loans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener los Loans' });
    }
}

async function changeLoanState(req, res) {
    try {
        const { loan_id, loan_state, loan_num } = req.body;

        const loan = await Loan.findOne({ where: { loan_id: loan_id } });

        if (!loan) {
            return res.status(404).json({ message: 'Loan no encontrado' });
        }

        if (loan_state === 'Aprobado') {
            const { user_id } = loan;

            const customer = await Customer.findOne({ where: { customer_id: user_id } });

            loan.loan_num = loan_num;
            loan.loan_state = loan_state;
            await loan.save();

            await transporter.sendMail({
                from: '"Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>',
                to: decrypt(customer.customer_personal_email) + ", " + decrypt(customer.customer_espe_email),
                subject: "Aviso de Préstamo - Fondo de Cesantía ESPE",
                html: `
                <b> Tu préstamo fue aceptado por el Fondo de Cesantía ESPE.</b>
                <a> El préstamo ${loan.loan_type} de $${loan.loan_amount} fue aprobado.</a>
                <br><br>
                <a> Recuerda que tu préstamo es de ${loan.loan_deadline} meses.</a>
                `
            });

        } else if (loan_state === 'Rechazado') {
            const loan = await Loan.findOne({ where: { loan_id: loan_id } });

            const { user_id } = loan;

            const customer = await Customer.findOne({ where: { customer_id: user_id } });

            loan.loan_num = loan_num;
            loan.loan_state = loan_state;
            await loan.save();

            await transporter.sendMail({
                from: '"Fondo de Cesantía ESPE" <pruebafondoespe@gmail.com>',
                to: decrypt(customer.customer_personal_email) + ", " + decrypt(customer.customer_espe_email),
                subject: "Aviso de Préstamo - Fondo de Cesantía ESPE",
                html: `
                <b> Tu préstamo fue denegado por el Fondo de Cesantía ESPE.</b>
                <a> El préstamo ${loan.loan_type} de $${loan.loan_amount} fue denegado.</a>
                <br><br>
                <a> Acércate a nuestras oficinas si deseas más información.</a>
                `
            });
        }
        res.status(201).json({ message: 'Loan actualizado', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar el Loan' });
    }
}

async function updateLoansAuto(req, res) {
    try {
        const { loan_json } = req.body;
        const loansToUpdate = loan_json;

        if (!loansToUpdate) {
            return res.status(404).json({ message: 'Loans no encontrados' });
        }

        for (let i = 0; i < loansToUpdate.length; i++) {
            const user = await User.findOne({ where: { user_ci: loansToUpdate[i].user_ci } });

            if (user) {
                const customer = await Customer.findOne({ where: { customer_id: user.user_id } });
                const loan = await Loan.findOne({ where: { loan_num: loansToUpdate[i].loan_num } });

                if (!loan) {
                    Loan.create({
                        user_id: user.user_id,
                        loan_num: loansToUpdate[i].loan_num,
                        loan_customer_name: customer.customer_name,
                        loan_type: loansToUpdate[i].loan_type,
                        loan_amount: loansToUpdate[i].loan_amount,
                        loan_deadline: loansToUpdate[i].loan_deadline,
                        loan_amortization_type: '',
                        loan_state: 'Aprobado',
                        loan_pending_amount: loansToUpdate[i].loan_pending_amount,
                        loan_guarantors: '',
                        createdAt: loansToUpdate[i].createdAt,
                    });
                }

                loan.loan_pending_amount = loansToUpdate[i].loan_pending_amount;
                await loan.save();
            }
        }
        res.status(201).json({ message: 'Préstamos actualizados', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar los Loans' });
    }
}

module.exports = { createLoan, getLoans, changeLoanState, getLoansByUser, updateLoansAuto };
