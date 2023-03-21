import React, { useState, useEffect, useRef } from "react";
import { Paper, Grid, Avatar, Typography, TextField, Button } from "@mui/material";
import ScreenLockLandscapeIcon from '@mui/icons-material/ScreenLockLandscape';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FaceMask from './face_mask.png';
import Signuppic from './image/M_LOGO.png';
import { isValid } from "./components/validator";
import { useNavigate } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import Head from "./components/head";
import Loader from "./components/loader";




const gender = [
    { label: 'Male' },
    { label: 'Female' },
    { label: 'Others' },];

let stream;


const Signup = () => {


    const paperStyle = { padding: 15, height: '680px', maxWidth: '640px', width: '90%', margin: '13px auto', }
    const avatarstyle = { backgroundcolor: '#FFFF00' }
    const headerstyle = { margin: 0 }
    const [open, setOpen] = React.useState(false);
    const [inputErrors,setInputErrors] = useState([]);
    // const [faceimg,setImage] = React.useState(null);
    const navigate = useNavigate();
    const canvasElement = useRef();
    const videoElement = useRef();
    const [openLoader,setOpenLoader] = useState(false);
    const [user, setUser] = useState({
        name: "", email: "", phone: "", password: "", cpassword: "", faceimg: ""
    })


    let name, value;
    const handleInputs = (index) => (e) => {
        console.log(e);
        name = e.target.name;
        value = e.target.value;
        if(!isValid(value,name)){
            setInputErrors((e) => {
                e[index] = "Invalid format";
                return [...e];
            })
        } else {
            setInputErrors((e) => {
                e[index] = false;
                return [...e];
            })
        }
        setUser({ ...user, [name]: value });

    }

    
    const PostData = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, cpassword, faceimg } = user;
        setOpenLoader(true);
        const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, email, phone, password, cpassword, faceimg
            })
        });
        setOpenLoader(false);
        

        const data = await res.json();
        if (data.status === 422 || !data) {
            window.alert("invalid Registration");
            console.log("invelid Registration");
        }
        else {
            if (!data?.error) {
                window.alert("Registration success");
                console.log("Registration success");
                navigate("/login")
                
            }
            else {
                window.alert(data.error);
                console.error(data.error);
            }

        }
    }


// camera function 

    function handleClose() {
        setOpen(false);
    }

    function handleCapture() {
        const video = videoElement.current;
        const canvas = canvasElement.current;

        canvas.width = 1920;
        canvas.height = 1080;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let faceimg = canvas.toDataURL('image/jpeg');
        setUser((e)=>({...e,faceimg}));
        handleClose();
    }

    useEffect(()=>{
        console.log(user);
    },[user]);


    async function getMedia(constraints) {
        return new Promise(async (r, e) => {
            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            if (mediaDevices.length === 0) {
                e("no media devices found!");
            }
            stream = null;
            for (let i = 0; i < mediaDevices.length; i++) {
                if (mediaDevices[i].kind === 'videoinput') {
                    try {
                        constraints.video = {
                            deviceId: {
                                exact: mediaDevices[i].deviceId
                            }
                        }
                        stream = await window.navigator.mediaDevices.getUserMedia(constraints);
                    } catch (_) { }
                }
            }
            if (stream === null) {
                e("Camera is not dectect 📷");
            } else {
                r(stream);
            }
        })
    }


    useEffect(() => {
        async function init() {
            try {
                stream = await getMedia({audio: false, video: true});
                const video = document.querySelector("#video");
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            } catch (e) {
                console.log(e);
                alert(e);
                setOpen(true);
            }
        }
        if (open) {
            init();
        }
    }, [open]);


    async function openDialog() {
        setOpen(true);
    }

    /* picture checking end */
    return (
        <>
        <Loader open={openLoader}/>
            <Grid><Head><title>Register | Acceso</title></Head>
                <Paper elavation={6} style={paperStyle} className="round darkShadow">
                    <section>
                        <div className="splitright"  >
                            <form method="POST">
                                <div>
                                    <Grid align="center">
                                        <Avatar style={avatarstyle} ><ScreenLockLandscapeIcon /></Avatar>
                                        <h3 style={headerstyle}> Create New user </h3>
                                        <Typography variant="caption" >Please fill this form to create an account!</Typography>
                                    </Grid>
                                </div>
                                <div style={{ width: "50%", float: "right" }} >
                                    <TextField className="sign__upp" fullWidth required label="Full Name" 
                                    name="name" placeholder="Enter your name" value={user.name} 
                                    onChange={handleInputs(0)} error={Boolean(inputErrors[0])} helperText={inputErrors[0]} autoComplete="off" variant="standard">
                                    </TextField >
                                    <FormControl>
                                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                                        {/* <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                                        </RadioGroup> */}
                                        <Autocomplete disablePortal id="combo-box-demo" options={gender} sx={{ width: 300 }} renderInput={(params) => <TextField variant="standard" {...params} label="Gender"/>}/>
                                    </FormControl>

                                    <TextField  fullWidth required label="Email" name="email" className="sign__upp" value={user.email} 
                                    onChange={handleInputs(1)} autoComplete="off" error={Boolean(inputErrors[1])} helperText={inputErrors[1]}variant="standard">
                                    </TextField >
                                    <TextField fullWidth required label="Phone Number" name="phone" className="sign__upp" value={user.phone} 
                                    onChange={handleInputs(2)} autoComplete="off" error={Boolean(inputErrors[2])} helperText={inputErrors[2]}variant="standard">
                                    </TextField >
                                    <TextField fullWidth required type={"password"} label="Password" name="password" className="sign__upp" value={user.password} 
                                    onChange={handleInputs(3)} autoComplete="off" error={Boolean(inputErrors[3])} helperText={inputErrors[3]}variant="standard">
                                    </TextField >
                                    <TextField fullWidth required type={"password"} label="Confirm Password" name="cpassword" className="sign__upp" value={user.cpassword} 
                                    onChange={handleInputs(4)} autoComplete="off" error={Boolean(inputErrors[4])} helperText={inputErrors[4]}variant="standard">
                                    </TextField >
                                    <span>
                                        <Button variant="contained" name="picture" style={{}} onClick={openDialog}>Take Picture</Button>
                                        <br/>
                                        <Button variant="contained" name="signup" style={{ margin: "6px 0", alignItems: "center" }} onClick={PostData}>Register</Button>
                                    </span><br/>
                                    <a href="/login"> Already have an account?</a>
                                </div>
                                <div className="side_image splitleft" style={{ width: "50%" }} >
                                    <figure>
                                        <img src={Signuppic} alt="register" style={{ width: "100%", height: 'fit-content' }} />
                                    </figure>
                                </div>
                                <div className="side_image splitleft" id="contentarea" style={{ width: "50%" }} >

                                <div className="output" >
                                    <img id="photo" alt="Hello User!" style={{ width: "50%", height: 'fit-content' }} src={user?.faceimg}  /><br></br>
                                    <Typography variant="caption" >Facial recognition is a biometric authentication technique.</Typography>
                                </div>
                                    


                                </div>
                            </form>
                        </div>

                    </section>
                </Paper>
            </Grid>

            <canvas className="display-none hidden canvas" ref={canvasElement}></canvas>


            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Take Photo</DialogTitle>
                <DialogContent>
                    <div className="camera">
                        <video id="video" ref={videoElement}>Video stream not available</video>
                        <img src={FaceMask} alt="Face Mask" className="face_mask" />
                        <div className="opacity"></div>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCapture} id="startbutton">Capture</Button>

                </DialogActions>
            </Dialog>

        </>
    )

}
export default Signup
