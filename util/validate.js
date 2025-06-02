const handleError = (error)=>{
  if(error.message.includes("User validation failed")){
  const errors = {}
  Object.values(error.errors).forEach((propError)=>{
    const {path,message} = propError.properties;
    errors[path] = message;
  });
  return {message : "User validation failed",errors}
  }

    if(error.message === 'Incorrect Email'){
    return {massage:"that email is not registered"};
  }
   //incorrect password
  if(error.message === 'Incorrect Password'){
    return {massage:"that password is incorrect"};
  }
  if(error.message == "There's no account"){
    return {massage:"There's no account for the provides email."}
  }
}

module.exports = handleError;