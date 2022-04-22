export const MAX_PROFILE_PICTURE_SIZE = 1024 * 1024
export const MAX_CAMPAIGN_IMAGE_SIZE = 1024 * 1024
export const MAX_CAMPAIGN_VIDEO_SIZE = 1024 * 1024


export const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export  const isValidUsername = (username) =>{
    return typeof username==='string' && username.length > 3
}

export const isValidPassword = (password) =>{
    return typeof password==='string' && password.length >5
}


export const isValidName = (name) =>{
    return typeof name==='string' && name.length > 2 && name.length <= 50
}


export const isValidString= (value , min , max, type) =>{
    return typeof value ==='string' && (min? value.length >= min : 0) && (max ? value.length <=max : true)
}


export const isValidProfilePicture = (profilePictureSize) =>{
    return  profilePictureSize.size <= MAX_PROFILE_PICTURE_SIZE
}

export const isValidImage = (image,maxSize) =>{
    return image.mimetype.startsWith('image') && image.size <= maxSize
}


export const isValidVideo = (video,maxSize) =>{
    return video.mimetype.startsWith('video') && video.size <= maxSize
}


export const  isAfter = (date1 , date2) =>{
 return date1 ? date2 ? new Date(date1).getMilliseconds() >= date2.getMilliseconds() : true : false
}


export  const isValidStartDate = (startDate ) =>{
    return startDate? new Date(startDate).getMilliseconds() > new Date().getMilliseconds() : false
}


export  const isValidEndDate = (startDate, endDate ) =>{
    return startDate && endDate ? new Date(startDate).getMilliseconds() < new Date(endDate).getMilliseconds() : false
}