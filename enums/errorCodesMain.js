/**
 * @enum errorCodes
 * This is the blueprint of all errorCodes. There is a converter file that converts this into a 2 way lookup based on ID or Name and places it into src folder.
 */
module.exports = {
    Invalid: {
        id: 0,
        detail: 'Invalid action - This action could have expired.'
    },
    OK: {
        id: 1,
        detail: 'All good'
    },
    Fail: {
        id: 2,
        detail: 'Failed to do action.'
    },
    NoConnection: {
        id: 3,
        detail: 'Failed to connect to server. Please retry.'
    },
    InvalidPassword: {
        id: 4,
        detail: 'Invalid Password'
    },
    InvalidParam: {
        id: 5,
        detail: 'One or more parameters are invalid.'
    },
    InvalidState: {
        id: 6,
        detail: 'Something not supposed to occur, occurred.'
    },
    InvalidName: 7,
    InvalidSession: {
        id: 8,
        detail: 'Invalid Session - Please re-login'
    },
    InvalidEmail: {
        id: 9,
        detail: 'Email address supplied is invalid.'
    },
    EmailExists: {
        id: 10,
        detail: 'This email address is already used.'
    },
    Timeout: 11,
    Banned: {
        id: 12,
        detail: 'This account is banned. Contact support.'
    },
    AccountNotFound: {
        id: 13,
        detail: 'Account was not found.'
    },
    NotLoggedOn: {
        id: 14,
        detail: 'You are no-longer logged on.'
    },
    InsufficientPrivilege: {
        id: 15,
        detail: 'You do not have the required permissions.'
    },
    Revoked: {
        id: 16,
        detail: 'This feature has been revoked.'
    },
    Expired: {
        id: 17,
        detail: 'This request has already expired.'
    },
    DuplicateRequest: {
        id: 18,
        detail: 'This action was repeated earlier.'
    },
    Suspended: {
        id: 19,
        detail: 'Action is suspended. Retry later.'
    },
    Cancelled: {
        id: 20,
        detail: 'Action was aborted.'
    },
    PasswordUnset: {
        id: 21,
        detail: 'Password was not set.'
    },
    IllegalPassword: {
        id: 22,
        detail: 'Password is not allowed. Too weak.'
    },
    AccountLogonDeniedNoMail: 23,
    AccountLockedDown: {
        id: 24,
        detail: 'Suspicious activity found, account locked down. Contact support.'
    },
    AccountLogonDeniedVerifiedEmailRequired: {
        id: 25,
        detail: 'Account requires verification. Check email.'
    },
    NoMatchingURL: 26,
    BadResponse: 27,
    UnexpectedError: 28,
    Disabled: 29,
    RateLimitExceeded: {
        id: 30,
        detail: 'You have been rate-limited, please wait %s.'
    },
    AccountLoginDeniedThrottle: 31,
    EmailSendFailure: 32,
    EmailAlreadyVerified: {
        id: 33,
        detail: 'Email address has already been verified.'
    },
    TermsNotAccepted: {
        id: 34,
        detail: 'Terms and Conditions were not accepted.'
    },
    InvalidAccessToken: {
        id: 35,
        detail: 'Unable to retrieve access token.'
    },
    Custom: {
        id: 36,
        detail: 'Catch-all error message, with descriptive error-log.'
    },
    FailedToSaveRecord: {
        id: 37,
        detail: 'Failed to save record into database.'
    },
    DuplicatePage: {
        id: 38,
        detail: 'This social page already is registered under someone\'s or own account.'
    },
    FailedToPostToPlatform: {
        id: 39,
        detail: 'Failed to do selected action on platform.'
    },
    FailedToGetFromPlatform: {
        id: 40,
        detail: 'Failed to get data from selected platform.'
    },
    NoPagesFound: {
        id: 41,
        detail: 'No remaining pages can be added.'
    },
    RequestNotFound: {
        id: 42,
        detail: 'This seems to be an invalid request.'
    },
    RangeTooBig: {
        id: 43,
        detail: 'Date range requested is too far apart.'
    },
    DateInPast: {
        id: 44,
        detail: 'You are unable to post in the past... It\'s just not right.'
    },
    DuplicateName: 45,
    AccessDenied: 46,
    MaxUsersOnPlatform: {
        id: 47,
        detail: 'Registration is disabled due to unexpected traffic.'
    },
    OneOrMorePagesInvalid: {
        id: 48,
        detail: 'One or more pages selected are invalid.'
    },
    InvalidPackage: {
        id: 49,
        detail: 'Invalid package has been chosen.'
    },
    paymentFailed: {
        id: 50,
        detail: 'Payment failed to go through.'
    },
    invalidPayment: {
        id: 51,
        detail: 'Payment referenced is not valid.'
    },
    packageAlreadyActive: {
        id: 52,
        detail: 'There is a package already active on the account.'
    },

};