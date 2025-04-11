from slowapi import Limiter

limiter = Limiter(key_func=lambda: "global")