class ApiError extends Error{
    construcor(statuscode,message="soemthing went wrong",error=[],stack){
        super(message);// it creates a standard error class
        this.statuscode=statuscode;
        this.error=error;
        this.stack=stack;
        this.data=null;
        this.success=false;

        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {ApiError}