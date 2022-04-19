export const MAX_PROFILE_PICTURE_SIZE = 1024 * 1024


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


export const isValidProfilePicture = (profilePictureSize) =>{
    return typeof profilePictureSize.name==='string' && profilePictureSize.size <= MAX_PROFILE_PICTURE_SIZE
}