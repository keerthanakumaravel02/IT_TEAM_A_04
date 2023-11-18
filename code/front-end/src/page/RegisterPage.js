import { useState } from 'react'
import './RegisterPage.css'
import { RegisterApi } from '../services/Api';
import { storeUserData } from '../services/Storage';
import { isAuthenticated } from '../services/Auth';
import { Link, Navigate } from 'react-router-dom';
import NavBar from '../components/NavBar';


export default function RegisterPage(){

    const initialStateErrors = {
        email:{requried:false},
        password:{requried:false},
        name:{requried:false},
        custom_error:null
    };

    const [errors,setErrors] = useState(initialStateErrors);

    const [loading,setLoading] = useState(false);

    const handleSubmit = (event) =>{
            event.preventDefault();

            let errors = initialStateErrors;
            let hasError = false;
            if(inputs.name == ""){
                errors.name.requried = true;
                hasError = true;
            }
            if(inputs.email == "")
            {
                errors.email.requried = true;
                hasError = true;
            }
            if(inputs.password == "")
            {
                errors.password.requried = true;
                hasError = true;
            }
            if (hasError != true){
                setLoading(true);
                RegisterApi(inputs).then((response)=>{
                    storeUserData(response.data.idToken);
                }).catch((err)=>{
                    if(err.response.data.error.message=="EMAIL_EXISTS"){
                        setErrors({...errors,custom_error:"Already this email has been Registered"})
                    }else if(String(err.response.data.error.message).includes('WEAK_PASSWORD')){
                        setErrors({...errors,custom_error:"Password should be atleast 6 characters"})
                    }
                }).finally(()=>{
                    setLoading(false)
                })

            }
            setErrors({...errors});

        }

    const [inputs,setInputs] = useState({
        email:"",
        password:"",
        name:""
    });
    const handleInputs = (event) =>{
            setInputs({...inputs,[event.target.name]:event.target.value})
    }
    if(isAuthenticated()){
        return <Navigate to="/dashboard" /> 
    }
    return(
        <div>
            <NavBar/>
            <section className="register-block">
                <div className="container">
                <div className="row ">
                    <div className="col register-sec">

<div className="col register-sec">
    <h2 className="text-center" style={{ color: 'black', paddingLeft: '50px', paddingRight: '50px' }}>Register Now</h2>

 
</div>

                        <form onSubmit={handleSubmit} className="register-form" action="" >
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Name</label>
            
                            <input type="text" className="form-control" onChange={handleInputs} name="name" id=""  />
                            {errors.name.requried?
                            (<span className="text-danger">
                                Name is required.
                            </span>):null
                            }       
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
            
                            <input type="text"  className="form-control" onChange={handleInputs} name="email" id=""  />
                            {errors.email.requried?
                            (<span className="text-danger" >
                                Email is required.
                            </span>):null
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                            <input  className="form-control" type="password" onChange={handleInputs}  name="password" id="" />
                            {errors.password.requried?
                            (<span className="text-danger" >
                                Password is required.
                            </span>):null
                            }
                        </div>
                        <div className="form-group text-right">
    <span className="text-danger">
        {errors.custom_error ?
            (<p>{errors.custom_error}</p>) : null
        }
    </span>
    {loading ?
        (<div className="text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>) : null
    }
</div>
<div className="form-group text-right">
    <input type="submit" className="btn btn-login" disabled={loading} value="Register" />
</div>
<div className="clearfix"></div>
<div className="form-group text-right">
    Already have an account? Please <Link to="/">Login</Link>
</div>

                        </form>
                    </div>
                </div>
                </div>
            </section>
        </div>
    )
 }