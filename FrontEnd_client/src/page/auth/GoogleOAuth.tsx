import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStoreBase } from "@/store/store";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";

const GoogleOAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAccessToken } = useStoreBase();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const accessToken = params.get("access_token");
  const currentWorkspace = params.get("current_workspace");
  const status = params.get("status");
  const returnUrl = params.get("returnUrl");

  React.useEffect(() => {
    if (status === "failure") {
      setError("Authentication failed. Please try again.");
      setIsLoading(false);
      return;
    }

    if (accessToken) {
      try {
        setAccessToken(accessToken);
        // Navigate to the appropriate page
        if (returnUrl) {
          setTimeout(() => {
            navigate(returnUrl);
          }, 500);
        } else if (currentWorkspace) {
          setTimeout(() => {
            navigate(`/workspace/${currentWorkspace}`);
          }, 500);
        } else {
          setTimeout(() => {
            navigate(`/`);
          }, 500);
        }
      } catch (err) {
        setError("An error occurred during authentication. Please try again.");
        setIsLoading(false);
      }
    } else {
      setError("No access token received. Please try again.");
      setIsLoading(false);
    }
  }, [accessToken, currentWorkspace, navigate, setAccessToken, status, returnUrl]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          Project Manager
        </Link>
        <div className="flex flex-col gap-6"></div>
      </div>
      <Card>
        <CardContent>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            {isLoading ? (
              <>
                <h1>Authenticating...</h1>
                <p>Please wait while we complete your sign-in.</p>
                <div className="flex justify-center mt-4">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              </>
            ) : (
              <>
                <h1>Authentication Failed</h1>
                <p>{error || "We couldn't sign you in with Google. Please try again."}</p>
                <Button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
                  Back to Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuth;
