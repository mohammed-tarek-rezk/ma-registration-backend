const mongoose = require("mongoose");
const validator = require("validator");
const { COMMUNITIES, STATUS, HOW_KNOW } = require("../utils/constants");

let memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: validator.isStrongPassword,
      message:
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters",
    },
    select: false,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validator: {
      validator: (phone) => {
        return /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/.test(phone);
      },
      message: "Please enter a valid phone number",
    },
  },
  facebook: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Please enter a valid Facebook URL",
    },
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  first: {
    type: Boolean,
    required: true,
  },
  how: {
    type: String,
    enum: [
      HOW_KNOW.FACEBOOK,
      HOW_KNOW.LINKEDIN,
      HOW_KNOW.FRIEND,
      HOW_KNOW.MEMBER,
      HOW_KNOW.COLLEGE,
    ],
    required: true,
  },
  firstCommunity: {
    type: String,
    required: true,
    enum: [
      COMMUNITIES.WEB,
      COMMUNITIES.DATA,
      COMMUNITIES.HRD,
      COMMUNITIES.HRM,
      COMMUNITIES.PR,
      COMMUNITIES.OPERATION,
      COMMUNITIES.SOCIAL,
      COMMUNITIES.MULTI,
      COMMUNITIES.VOICE,
      COMMUNITIES.TECHNICAL,
    ],
  },
  secondCommunity: {
    type: String,
    required: true,
    enum: [
      COMMUNITIES.WEB,
      COMMUNITIES.DATA,
      COMMUNITIES.HRD,
      COMMUNITIES.HRM,
      COMMUNITIES.PR,
      COMMUNITIES.OPERATION,
      COMMUNITIES.SOCIAL,
      COMMUNITIES.MULTI,
      COMMUNITIES.VOICE,
      COMMUNITIES.TECHNICAL,
    ],
  },
  open_space: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  verificationExp: Date,
  resetPasswordToken: String,
  resetPasswordExp: Date,
  status: {
    type: Array,
    default: [
      { id: 0, state: STATUS.APPLICATION_SUBMITTED, date: new Date() , done: true },
      { id: 1, state: STATUS.UNDER_REVIEW, date: new Date() , done: false },
      { id: 2, state: STATUS.INTERVIEW_SCHEDULED, date: new Date() , done: false },
      { id: 3, state: STATUS.INTERVIEW_COMPLETED, date: new Date() , done: false },
      { id: 4, state: STATUS.PENDING_TASK, date: new Date() , done: false },
      { id: 5, state: STATUS.REJECTED, date: new Date() , done: false },
      { id: 6, state: STATUS.ACCEPTED, date: new Date() , done: false },
    ],
  },
  moderator:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moderator"
  },
  acceptedIn:{
    type: Array,
    default: []
  }
}, {timestamps: true});

let Member = mongoose.model("Member", memberSchema);

module.exports = Member;
