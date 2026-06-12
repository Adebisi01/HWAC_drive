import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "\nPassword must contain at least one uppercase letter")
    .regex(/[a-z]/, "\nPassword must contain at least one lowercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "\nPassword must contain at least one special character",
    ),
  confirm_password: z.string(),
});

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onBlur" });
  const onSubmit = async (data: FieldValues) => {
    try {
      const { name, email, password } = data;

      const res = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (res.error) {
        toast.error(res.error.message, { position: "top-center" });
      } else if (res.data) {
        toast.success("User registered successfully", {
          position: "top-center",
        });
        navigate("/");
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="h-screen w-full">
        <div className="flex items-center justify-center px-2 py-10">
          <Card className="-my-4 w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription className="text-lg">
                Enter your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} id="signup-form">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label>Full name</Label>
                    <Input
                      placeholder="John doe"
                      {...register("name")}
                      required
                    />
                    <span className="text-red-500">
                      {" "}
                      {errors.name?.message}{" "}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Email address</Label>
                    <Input
                      placeholder="example@gmail.com"
                      {...register("email")}
                    />
                    <span className="text-red-500">
                      {" "}
                      {errors.email?.message}{" "}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      {...register("password")}
                      required
                    />
                    <span className="text-red-500">
                      {" "}
                      {errors.password?.message}{" "}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Confirm password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="Confirm your password"
                      {...register("confirm_password")}
                      required
                    />
                    <span className="text-red-500">
                      {" "}
                      {errors.confirm_password?.message}{" "}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-1 accent-black">
                      <input type="checkbox" />
                      <span> I agree to the</span>
                      <a
                        href="##"
                        className=" inline-block text-sm underline underline-offset-4"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <Button form="signup-form" type="submit" className="w-full">
                {isSubmitting ? <Spinner /> : "Sign up"}
              </Button>
              <div className="">
                <span className="text-sm text-gray-500">
                  Already have an account?
                </span>
                <span
                  onClick={() => {
                    navigate("/auth/sign-in");
                  }}
                  className="w-full"
                >
                  Sign-in
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};
