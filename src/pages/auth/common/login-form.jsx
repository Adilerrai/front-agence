import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "@/services/apiService";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/store/api/auth/authSlice";
const schema = yup
  .object({
    username: yup.string().required("Username is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Login attempt with data:", data);
      const response = await authService.login(data);
      console.log("Login response:", response);

      // Support both old (access_token) and new (token) API response formats
      const token = response.token || response.access_token;
      if (!token) {
        throw new Error("Invalid credentials - no access token received");
      }

      // Mettre à jour l'état Redux
      dispatch(setToken(token));
      dispatch(setUser({
        id: response.id,
        email: response.email,
        username: response.username,
        nomComplet: response.nomComplet,
        telephone: response.telephone,
        genre: response.genre,
        role: response.role,
        pointDeVenteId: response.pointDeVenteId,
        // Support old format
        firstName: response.firstName,
        lastName: response.lastName,
        phone: response.phone,
        roles: response.roles,
        allowedAPP: response.allowedAPP
      }));

      // Stocker dans localStorage (already done by authService._storeAuthData)
      // No need to duplicate storage here

      navigate("/dashboard");
      toast.success("Connexion réussie");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Échec de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <InputGroup
        name="username"
        type="text"
        label="username"
        placeholder="username"
        prepend={<Icon icon="ph:user" />}
        defaultValue=""
        register={register}
        error={errors.username}
        merged
        disabled={isLoading}
      />
      <InputGroup
        name="password"
        label="password"
        type="password"
        placeholder="password"
        prepend={<Icon icon="ph:lock-simple" />}
        defaultValue=""
        register={register}
        error={errors.password}
        merged
        disabled={isLoading}
      />

      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Remember me"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-gray-400 dark:text-gray-400 hover:text-indigo-500 hover:underline  "
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-primary block w-full text-center "
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
