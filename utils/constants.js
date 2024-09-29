

const   HOW_KNOW = {
    FACEBOOK: 'facebook',
    LINKEDIN: 'linkedin',
    COLLEGE: "college",
    FRIEND: "friend",
    MEMBER: "member",
}
const   COMMUNITIES = {
    HRD: 'HRD',
    HRM: 'HRM',
    PR: "PR",
    OPERATION: "operation",
    SOCIAL: "social media",
    MULTI: "multi media",
    VOICE: "voice over",
    TECHNICAL: "technical", 
    WEB: "IT web Development",
    DATA: "IT data Analysis",
}


const STATUS= {
    APPLICATION_SUBMITTED: 'application submitted', 
    UNDER_REVIEW: 'under review',
    INTERVIEW_SCHEDULED: 'interview scheduled',
    INTERVIEW_COMPLETED: 'interview completed',
    PENDING_TASK: 'pending task',
    ACCEPTED: 'accepted',
    REJECTED: "rejected"
}

const nationalIdValidation = (value)=>{
    return /^([2-3]{1})([0-9]{2})(0[1-9]|1[012])(0[1-9]|[1-2][0-9]|3[0-1])(0[1-4]|[1-2][1-9]|3[1-5]|88)[0-9]{3}([0-9]{1})[0-9]{1}$/.test(value)
}

module.exports = {
    HOW_KNOW, 
    COMMUNITIES,  
    STATUS,
    nationalIdValidation,

}