// deals with async functions and higher order functions

const asyncHandler=(requestHandler)=>{
    return (req, res, next) => { //chunk out the req and res of requestHandler and use a next middleware 
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err));
    };
}

export {asyncHandler}