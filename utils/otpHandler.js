
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
    
        // console.log("Expiry Minutes: " + Math.abs(differenceValue));
    
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

// One time Login OTP 
const generateOtp6Digit = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

const checkOtpIsExpired = async (expiryDate) => {
    try {
        // console.log('TimeStamp: ' + new Date(expiryDate).getTime());
        const c_dateTime = new Date().getTime();
        // console.log('TimeStamp CC: ' + c_dateTime);
        var differenceInTime = (new Date(expiryDate).getTime() - c_dateTime);
        var differenceInDays = Math.round(differenceInTime / ( 1000 * 3600 * 24));
        // console.log('Expiry Days: ' + differenceInDays);

        if( differenceInDays > 5 ) {
            return true;
        }
        return false;
    } catch (e) {
        console.log("Error: " + e);
    }
}
module.exports = {
    generateOtpDigit,
    oneMinuteExpiry,
    threeMinuteExpiry,
    customMinuteExpiry,
    generateOtp6Digit,
    checkOtpIsExpired,
}