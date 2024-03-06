const fs = require("fs");
const path = require("path");

const uploadImageOLD = async (imgUrl, bufferData) => {
    console.log(path.join(__dirname, ".."+imgUrl));
    await fs.writeFileSync(path.join(__dirname, ".."+imgUrl), bufferData);
}

const uploadImage = async (userAvatar, destinationPath) => {
    // let destinationPath = '/upload/user/avatar';
    destinationPath = `/public/${destinationPath}/`;
    let imgName = Date.now() + '-' + userAvatar.originalname;
    let userAvatarUrl = destinationPath + imgName;
    
    console.log(path.join(__dirname, ".."+userAvatarUrl));
    await fs.writeFileSync(path.join(__dirname, ".."+userAvatarUrl), userAvatar.buffer);
    return userAvatarUrl;
}

const fileFilter = (file) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        return true;
    }
    return false;
}

module.exports = {
    uploadImageOLD,
    uploadImage,
    fileFilter
}