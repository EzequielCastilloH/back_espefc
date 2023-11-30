const express = require('express');
const cors = require('cors');
const router = express.Router();
const multer = require('multer');
const userController = require('../controller/UserController');
const QuestionController = require('../controller/QuestionController');
const LoanController = require('../controller/LoanController');
const UserSecurityQuestionController = require('../controller/UserSecurityQuestionController');
const NewController = require('../controller/NewController');
const CarController = require('../controller/CarController');
const CarVideoController = require('../controller/CarVideoController');
const EducationController = require('../controller/EducationController');

router.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/uploadPdf', upload.array('pdfs', 5), async (req, res) => {
    try {
      const mailOptions = {
        from: 'pruebafondoespe@gmail.com',
        to: 'fondoespe@espe.edu.ec',
        subject: 'Proceso de solicitud de préstamo',
        text: 'Este correo es para notificar que un usuario ha solicitado un préstamo y ha adjuntado los siguientes documentos:',
        attachments: req.files.map(file => ({
          filename: file.originalname,
          content: file.buffer,
        })),
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado correctamente');
      res.status(200).send('Correo enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo', error);
      res.status(500).send('Error al enviar el correo');
    }
  });

//User
router.post('/createUser', userController.createUserWithCustomer);
router.get('/pendingUsers', userController.getPendingUsers);
router.post('/avalibleUser', userController.setUserAvalible);
router.post('/disableUser', userController.setUserDisable);
router.post('/loginUser', userController.loginUser);
router.post('/editUser', userController.editUser);
router.post('/changePassword', userController.changePassword);
router.get('/getApprovedUsers', userController.getApprovedUsers);
router.post('/sendSuggestion', userController.sendSuggestion);
router.post('/getUserById', userController.getUserById);

//Questions
router.get('/questions', QuestionController.getAllQuestions);

//User Questions
router.post('/userQuestions', UserSecurityQuestionController.getUserQuestions);
router.post('/userAnswers', UserSecurityQuestionController.getUserAnswers);

//Loans
router.post('/createLoan', LoanController.createLoan);
router.get('/getLoans', LoanController.getLoans);
router.post('/changeLoanState', LoanController.changeLoanState);
router.post('/getLoansByUser', LoanController.getLoansByUser);

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

module.exports = router;