"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TextField, Dialog, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSignup } from "@/hooks/useSignup";
import { useLogin } from "@/hooks/useLogin";
import CountrySelect from '../../../../components/CountrySelect';

const AuthPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [dialogs, setDialogs] = useState({
    verification: false,
    unverified: false
  });
  
  const handleCountryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      country: value
    }));
    clearError();
  };
  
  const { login, error: loginError, isLoading: loginLoading } = useLogin();
  const { signup, error: signupError, isLoading: signupLoading } = useSignup();

  const [uiError, setUiError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    phone: "",
    address: "",
    city: "",
    country: null,
    businessName: "",
    gender: "",
    age: ""
  });

  useEffect(() => {
    if (mode === "login" && loginError) {
      setUiError(loginError);
    } else if (mode === "signup" && signupError) {
      setUiError(signupError);
    }
  }, [loginError, signupError, mode]);

  const clearError = () => {
    setUiError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      if (mode === "login") {
        const success = await login(formData.email, formData.password);
        if (!success) {
          setUiError(loginError || "Login failed");
          if (loginError?.includes("not verified")) {
            setDialogs(prev => ({ ...prev, unverified: true }));
          }
        }
      } else {
        // Convert age to number before sending
        const formDataToSend = {
          ...formData,
          age: parseInt(formData.age, 10)
        };
        const success = await signup(formDataToSend);
        if (success) {
          setDialogs(prev => ({ ...prev, verification: true }));
        } else {
          setUiError(signupError || "Signup failed");
        }
      }
    } catch (err) {
      setUiError(err.message || "An unexpected error occurred");
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === "login" ? "signup" : "login");
    setFormData({
      email: "",
      password: "",
      username: "",
      phone: "",
      address: "",
      city: "",
      country: null,
      businessName: "",
      gender: "",
      age: ""
    });
    clearError();
  };

  return (
    <>
      <VerificationDialog
        open={dialogs.verification}
        onClose={() => {
          setDialogs(prev => ({ ...prev, verification: false }));
          toggleMode();
        }}
        type="signup"
      />
      
      <VerificationDialog
        open={dialogs.unverified}
        onClose={() => setDialogs(prev => ({ ...prev, unverified: false }))}
        type="unverified"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        <BrandingSection />
        <div className="flex items-center justify-center p-10 bg-white">
          <div className="max-w-md w-full space-y-8">
            <AuthHeader mode={mode} onToggle={toggleMode} />
            <ErrorMessage error={uiError} />
            <form onSubmit={handleSubmit} className="space-y-4">
              <CommonFields formData={formData} onChange={handleInputChange} />
              {mode === "signup" && (
                <SignupFields 
                  formData={formData} 
                  onChange={handleInputChange}
                  onCountryChange={handleCountryChange}
                />
              )}
              <SubmitButton mode={mode} isLoading={mode === "login" ? loginLoading : signupLoading} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

const BrandingSection = () => (
  <div className="relative bg-gray-100 flex justify-center items-center p-10">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-500 opacity-60" />
    <Image
      src="/assets/auction/auction5-removebg-preview.png"
      layout="fill"
      objectFit="contain"
      alt="Auction illustration"
    />
  </div>
);

const AuthHeader = ({ mode, onToggle }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold mb-2">
      {mode === "login" ? "Welcome back" : "Join BidMaster"}
    </h2>
    <p className="text-gray-600">
      {mode === "login" ? "New to BidMaster?" : "Already have an account?"}{" "}
      <button
        type="button"
        onClick={onToggle}
        className="text-blue-600 hover:underline"
      >
        {mode === "login" ? "Sign up" : "Sign in"}
      </button>
    </p>
  </div>
);

const CommonFields = ({ formData, onChange }) => (
  <div className="space-y-4">
    <TextField
      label="Email"
      name="email"
      type="email"
      value={formData.email}
      onChange={onChange}
      fullWidth
      required
    />
    <TextField
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={onChange}
      fullWidth
      required
    />
  </div>
);

const SignupFields = ({ formData, onChange, onCountryChange }) => (
  <div className="space-y-4">
    <TextField
      label="Username"
      name="username"
      value={formData.username}
      onChange={onChange}
      fullWidth
      required
    />

    <div className="grid grid-cols-2 gap-4">
      <FormControl fullWidth required>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={onChange}
          label="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={onChange}
        inputProps={{ min: 18, max: 120 }}
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
        required
      />
      <TextField
        label="City"
        name="city"
        value={formData.city}
        onChange={onChange}
        required
      />
    </div>

    <div className="flex gap-4">
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={onChange}
        className="flex-1"
        required
      />
      <div className="flex-1">
        <CountrySelect
          value={formData.country}
          onChange={(value) => onCountryChange(value)}
        />
      </div>
    </div>

    <TextField
      label="Business Name"
      name="businessName"
      value={formData.businessName}
      onChange={onChange}
      fullWidth
      required
    />
  </div>
);


const SubmitButton = ({ mode, isLoading }) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
  >
    {isLoading 
      ? `${mode === "login" ? "Logging in" : "Signing up"}...` 
      : mode === "login" ? "Log in" : "Sign up"
    }
  </button>
);

const VerificationDialog = ({ open, onClose, type }) => (
  <Dialog open={open} onClose={onClose}>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {type === "signup" 
          ? "Account Created Successfully" 
          : "Account Not Verified"
        }
      </h2>
      <p className="mb-4">
        {type === "signup"
          ? "Please check your email to verify your account. A verification link has been sent to your inbox."
          : "Your account needs to be verified. Please check your email for the verification link."
        }
      </p>
      <Button 
        onClick={onClose}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        OK
      </Button>
    </div>
  </Dialog>
);

export default AuthPage;