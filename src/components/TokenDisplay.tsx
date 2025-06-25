import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, AlertTriangle } from "lucide-react";
import { getUserTokens, UserTokens } from "@/utils/tokenManager";

export const TokenDisplay = () => {
  const { user } = useUser();
  const [tokens, setTokens] = useState<UserTokens | null>(null);

  useEffect(() => {
    if (user?.id) {
      const userTokens = getUserTokens(user.id);
      setTokens(userTokens);
    }
  }, [user?.id]);

  const refreshTokens = () => {
    if (user?.id) {
      const userTokens = getUserTokens(user.id);
      setTokens(userTokens);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshTokens, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (!tokens || !user) return null;

  const isLowTokens = tokens.remaining < 100;
  const isOutOfTokens = tokens.remaining < 10;

  return (
    <Card className="p-2 sm:p-3 bg-gray-900/50 border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isOutOfTokens ? "text-red-500" : isLowTokens ? "text-yellow-500" : "text-green-500"}`}
          />
          <span className="text-xs sm:text-sm font-medium text-gray-300">
            Tokens: {tokens.remaining.toLocaleString()}
          </span>
        </div>

        {isLowTokens && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-5 sm:h-6 px-1 sm:px-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              Upgrade
            </Button>
          </div>
        )}
      </div>

      {isOutOfTokens && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-400">
          ⚠️ Out of tokens! Upgrade to continue using SECRECY.
        </div>
      )}
    </Card>
  );
};
