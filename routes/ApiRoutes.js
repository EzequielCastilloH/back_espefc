const express = require('express');
const cors = require('cors');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const transporter = require('../utils/mailer');
const userController = require('../controller/UserController');
const QuestionController = require('../controller/QuestionController');
const LoanController = require('../controller/LoanController');
const UserSecurityQuestionController = require('../controller/UserSecurityQuestionController');
const NewController = require('../controller/NewController');
const CarController = require('../controller/CarController');
const CarVideoController = require('../controller/CarVideoController');
const EducationController = require('../controller/EducationController');
const DeductibleController = require('../controller/DeductibleController');
const InstitutionController = require('../controller/InstitutionController');

router.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limitar el tamaño a 5 MB por archivo
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf') {
      return cb(new Error('Solo se permiten archivos PDF'));
    }
    cb(null, true);
  },
})

router.post('/uploadPdf', upload.array('pdfs', 13), async (req, res) => {
  console.log(req.files);  
  try {
      
      const mailOptions = {
        from: 'pruebafondoespe@gmail.com',
        to: 'jnmolina@espe.edu.ec',
        subject: 'Proceso de solicitud de préstamo',
        text: 'Este correo es para notificar que un usuario ha solicitado un préstamo y ha adjuntado los siguientes documentos:',
        attachments: req.files.map(file => ({
          filename: file.originalname,
          path: file.path,
        })),
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado correctamente');
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      res.status(200).send('Correo enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo', error);
      res.status(500).send('Error al enviar el correo');
    }
  });

//User
router.post('/createUser', userController.createUserWithCustomer);
router.post('/pendingUsers', userController.getPendingUsers);
router.post('/avalibleUser', userController.setUserAvalible);
router.post('/disableUser', userController.setUserDisable);
router.post('/loginUser', userController.loginUser);
router.post('/editUser', userController.editUser);
router.post('/changePassword', userController.changePassword);
router.post('/getApprovedUsers', userController.getApprovedUsers);
router.post('/sendSuggestion', userController.sendSuggestion);
router.post('/getUserById', userController.getUserById);
router.post('/updateBalance', userController.updateBalanceAuto);
router.post('/editBalanceManual', userController.editBalanceManually);
router.post('/updateFirstTime', userController.updateFirstTime);

//Questions
router.get('/questions', QuestionController.getAllQuestions);

//User Questions
router.post('/userQuestions', UserSecurityQuestionController.getUserQuestions);
router.post('/userAnswers', UserSecurityQuestionController.getUserAnswers);

//Loans
router.post('/createLoan', LoanController.createLoan);
router.post('/getLoans', LoanController.getLoans);
router.post('/changeLoanState', LoanController.changeLoanState);
router.post('/getLoansByUser', LoanController.getLoansByUser);
router.post('/updateLoansAuto', LoanController.updateLoansAuto);

//News
router.post('/createNew', NewController.createNew);
router.get('/getNews', NewController.getNews);
router.post('/getNewById', NewController.getNewById);
router.post('/updateNew', NewController.updateNew);

//Cars
router.post('/createCar', CarController.createCar);
router.get('/getCars', CarController.getCars);
router.post('/getCarById', CarController.getCarById);
router.post('/updateCar', CarController.updateCar);

//Cars Videos
router.post('/createCarVideo', CarVideoController.createCarVideo);
router.get('/getCarVideos', CarVideoController.getCarVideos);
router.post('/getCarVideoByBrand', CarVideoController.getCarVideoByBrand);
router.post('/updateCarVideo', CarVideoController.updateCarVideo);

//Education
router.post('/createEducation', EducationController.createEducation);
router.get('/getEducations', EducationController.getEducations);
router.post('/getEducationById', EducationController.getEducationById);
router.post('/updateEducation', EducationController.updateEducation);

//Deductibles
router.post('/deductibles', DeductibleController.getDeductibles);
router.post('/editDeductible', DeductibleController.editDeductibleByType);
router.post('/createDeductible', DeductibleController.createDeductible);

//Institutions
router.post('/institutions', InstitutionController.getInstitutions);
router.post('/updateInstitution', InstitutionController.updateInstitution);
router.post('/createInstitution', InstitutionController.createInstitution);
router.post('/getInstitutionById', InstitutionController.deleteInstitution);

module.exports = router;