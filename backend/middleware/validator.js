import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
];

export const validateCreateOrder = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.itemId').notEmpty().withMessage('Item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('paymentMethod').isIn(['cod', 'card', 'upi']).withMessage('Invalid payment method'),
];

export const validateCreateOutlet = [
  body('name').notEmpty().withMessage('Outlet name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('cuisine').notEmpty().withMessage('Cuisine type is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('deliveryTime').isInt({ min: 1 }).withMessage('Delivery time must be a positive integer'),
];

export const validateCreateMenuItem = [
  body('name').notEmpty().withMessage('Item name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('image').isURL().withMessage('Valid image URL is required'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};