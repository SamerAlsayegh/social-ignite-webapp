/**
 * @enum platforms
 * This is the blueprint of all platforms. There is a converter file that converts this into a 2 way lookup based on ID or Name and places it into src folder.
 */
module.exports = {
    'facebook': {
        id: 0,
        detail: 'Facebook'
    },
    'twitter': {
        id: 1,
        detail: 'Twitter'
    },
    'pinterest': {
        id: -2,// Unsupported yet, therefore -'ve
        detail: 'Pinterest'
    },
    'google-plus': {
        id: -3,// Unsupported yet, therefore -'ve
        detail: 'Google-Plus'
    },
    'instagram': {
        id: 4,
        detail: 'Instagram'
    },
    'linkedin': {
        id: 5,
        detail: 'LinkedIn'
    }
};