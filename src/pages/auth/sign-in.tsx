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
  email: z.string(),
  password: z.string(),
});
export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onBlur" });
  const navigate = useNavigate();
  const onSubmit = async (data: FieldValues) => {
    try {
      const { email, password } = data;
      const res = await authClient.signIn.email({
        email,
        password,
      });
      if (res.error) {
        toast.error("Invalid credentials", { position: "top-center" });
      } else if (res.data) {
        toast.success("Welcome to HWAC Drive", { position: "top-center" });
        navigate("/");
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="flex items-center justify-center py-10">
        <Card className="-my-4 w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription className="text-lg">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} id="login-form">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label>Email address</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="example@gmail.com"
                  />
                  <span className="text-red-500">{errors.email?.message}</span>
                </div>
                <div className="grid gap-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                  />
                  <span className="text-red-500">
                    {errors.password?.message}
                  </span>
                </div>

                <div className="grid gap-2"></div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button form="login-form" type="submit" className="w-full">
              {isSubmitting ? <Spinner /> : "Login"}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
