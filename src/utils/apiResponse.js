class apiResponse{
    constructor(statusCode, data, Message="SUCCESS"){
        this.statusCode=statusCode;
        this.data=data;
        this.Message=Message;   
        this.success=statusCode<400;// if true,it is not in failed series(400-600)

    }
}

export {apiResponse}

//this is to handle the api responses