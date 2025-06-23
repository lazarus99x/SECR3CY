
import { useUser } from '@clerk/clerk-react';

export interface UserTokens {
  total: number;
  used: number;
  remaining: number;
}

const TOKEN_COST_PER_REQUEST = 10;
const INITIAL_TOKEN_LIMIT = 2000;

export const getTokenKey = (userId: string) => `tokens_${userId}`;

export const initializeUserTokens = (userId: string): UserTokens => {
  const tokenKey = getTokenKey(userId);
  const existingTokens = localStorage.getItem(tokenKey);
  
  if (!existingTokens) {
    const initialTokens: UserTokens = {
      total: INITIAL_TOKEN_LIMIT,
      used: 0,
      remaining: INITIAL_TOKEN_LIMIT
    };
    localStorage.setItem(tokenKey, JSON.stringify(initialTokens));
    return initialTokens;
  }
  
  return JSON.parse(existingTokens);
};

export const getUserTokens = (userId: string): UserTokens => {
  const tokenKey = getTokenKey(userId);
  const tokens = localStorage.getItem(tokenKey);
  
  if (!tokens) {
    return initializeUserTokens(userId);
  }
  
  return JSON.parse(tokens);
};

export const deductTokens = (userId: string): boolean => {
  const tokens = getUserTokens(userId);
  
  if (tokens.remaining < TOKEN_COST_PER_REQUEST) {
    return false; // Not enough tokens
  }
  
  const updatedTokens: UserTokens = {
    ...tokens,
    used: tokens.used + TOKEN_COST_PER_REQUEST,
    remaining: tokens.remaining - TOKEN_COST_PER_REQUEST
  };
  
  const tokenKey = getTokenKey(userId);
  localStorage.setItem(tokenKey, JSON.stringify(updatedTokens));
  return true;
};

export const addTokens = (userId: string, amount: number): UserTokens => {
  const tokens = getUserTokens(userId);
  
  const updatedTokens: UserTokens = {
    total: tokens.total + amount,
    used: tokens.used,
    remaining: tokens.remaining + amount
  };
  
  const tokenKey = getTokenKey(userId);
  localStorage.setItem(tokenKey, JSON.stringify(updatedTokens));
  return updatedTokens;
};
