const { S3 } = require("aws-sdk");

const s3Upload = async (file, imgUrl) => {
    const s3 = new S3();
    // destinationPath = `uploads/${destinationPath}/`;
    // let imgName = Date.now() + '-' + file.originalname;
    // let imgUrl =  destinationPath + imgName;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imgUrl,
        Body: file.buffer
    };
    // console.log(params);
    return await s3.upload(params).promise();
}

const s3Delete = (imgUrl) => {
    const s3 = new S3();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imgUrl,
    };

    return s3.deleteObject(params).promise();
}

module.exports = {
    s3Upload,
    s3Delete
}