const catchAsync = require("./catchAsync");

const generateOtpDigit = async () => {
    return Math.floor( 1000 + Math.random() * 9000);
}

const oneMinuteExpiry = async (otpTime) => {
    try {
        // console.log('TimeStamp: ' + new Date(otpTime).getTime());
        const c_dateTime = new Date().getTime();
        // console.log('TimeStamp CC: ' + c_dateTime);
        var differenceValue = ( new Date(otpTime).getTime() - c_dateTime ) / 1000;
        differenceValue /= 60;
    
        // console.log("Expiry Minutes: " + Math.abs(differenceValue));
    
        if(Math.abs(differenceValue) > 1) {
            return true; 
        }
        return false; 
    } catch (error) {
        console.log("Error: " + error);
    }   
};


const threeMinuteExpiry = async (otpTime) => {
    try {
        // console.log('TimeStamp: ' + new Date(otpTime).getTime());
        const c_dateTime = new Date().getTime();
        // console.log('TimeStamp CC: ' + c_dateTime);
        var differenceValue = ( new Date(otpTime).getTime() - c_dateTime ) / 1000;
        differenceValue /= 60;
    
        console.log("Expiry Minutes: " + Math.abs(differenceValue));
    
        if(Math.abs(differenceValue) > 3) {
            return true; 
        }
        return false; 
    } catch (error) {
        console.log("Error: " + error);
    }   
};

const customMinuteExpiry = async (otpTime, minute = 1) => {
    try {
        // console.log('TimeStamp: ' + new Date(otpTime).getTime());
        const c_dateTime = new Date().getTime();
        // console.log('TimeStamp CC: ' + c_dateTime);
        var differenceValue = ( new Date(otpTime).getTime() - c_dateTime ) / 1000;
        differenceValue /= 60;
    
        console.log("Expiry Minutes: " + Math.abs(differenceValue));
    
        if(Math.abs(differenceValue) > minute) {
            return true; 
        }
        return false; 
    } catch (error) {
        console.log("Error: " + error);
    }   
};

module.exports = {
    generateOtpDigit,
    oneMinuteExpiry,
    threeMinuteExpiry,
    customMinuteExpiry
}