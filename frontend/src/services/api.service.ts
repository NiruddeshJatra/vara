import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "@/components/ui/use-toast";
import config from "../config";

/**
 * Creates a configured Axios instance for API calls
 * Includes interceptors for authentication and error handling
 */
class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    // Create axios instance with base URL and credentials
    this.api = axios.create({
      baseURL: config.apiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding authentication token and transforming data
    this.api.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(config.auth.tokenStorageKey);
        if (token && reqConfig.headers) {
          if (typeof reqConfig.headers.set === "function") {
            reqConfig.headers.set("Authorization", `Bearer ${token}`);
          } else {
            reqConfig.headers["Authorization"] = `Bearer ${token}`;
          }
        }

        // Remove Content-Type header if sending FormData
        if (reqConfig.data instanceof FormData && reqConfig.headers) {
          delete reqConfig.headers['Content-Type'];
        }

        // Skip transformation for FormData requests
        if (!(reqConfig.data instanceof FormData)) {
          // Transform request data from camelCase to snake_case
          if (reqConfig.data) {
            reqConfig.data = this.transformToSnakeCase(reqConfig.data);
          }
        }
        return reqConfig;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor for handling errors and transforming data
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Transform response data from snake_case to camelCase
        if (response.data) {
          if (response.data instanceof FormData) {
            const formData = new FormData();
            for (const [key, value] of response.data.entries()) {
              formData.append(this.transformToCamelCase(key), value);
            }
            response.data = formData;
          } else {
            response.data = this.transformToCamelCase(response.data);
          }
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 errors (unauthorized)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          localStorage.getItem(config.auth.userStorageKey) &&
          !(
            originalRequest.url &&
            originalRequest.url.includes("complete_profile")
          )
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(
              config.auth.refreshTokenStorageKey
            );
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Define the expected refresh response type
            interface RefreshTokenResponse {
              access: string;
            }

            const refreshResponse = await axios.post<RefreshTokenResponse>(
              `${config.baseUrl}${config.auth.refreshTokenEndpoint}`,
              { refresh: refreshToken },
              { withCredentials: true }
            );

            // Explicitly assert the type of data
            const { access } = refreshResponse.data as RefreshTokenResponse;

            if (access && originalRequest.headers) {
              localStorage.setItem(
                config.auth.tokenStorageKey,
                access
              );
              if (typeof originalRequest.headers.set === "function") {
                originalRequest.headers.set("Authorization", `Bearer ${access}`);
              } else {
                originalRequest.headers["Authorization"] = `Bearer ${access}`;
              }
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            if (
              !(
                originalRequest.url &&
                originalRequest.url.includes("complete_profile")
              )
            ) {
              localStorage.removeItem(config.auth.userStorageKey);
              localStorage.removeItem(config.auth.tokenStorageKey);
              localStorage.removeItem(config.auth.refreshTokenStorageKey);
              toast({
                title: "Session Expired",
                description: "Your session has expired. Please log in again.",
                variant: "destructive"
              });
              window.location.href = config.auth.loginEndpoint;
            }
          }
        }

        // Handle API errors
        if (error.response?.data) {
          const errorData = error.response.data;
          
          // Handle 400 errors (bad request)
          if (error.response.status === 400) {
            if (
              typeof errorData === "object" &&
              errorData !== null &&
              "error" in errorData
            ) {
              const err = errorData as { error?: string };
              if (err.error) {
                toast({
                  title: "Error",
                  description: err.error,
                  variant: "destructive"
                });
                return Promise.reject(new Error(err.error));
              }
            }

            // Format field-specific errors nicely
            const formattedErrors = [];
            if (typeof errorData === "object" && errorData !== null) {
              const err = errorData as {
                images?: string[];
                pricing_tiers?: any;
                unavailable_dates?: any;
                product_type?: any;
                category?: any;
                purchase_year?: any;
                error?: string;
              };
              if (err.images) {
                formattedErrors.push(`Images: ${err.images.join(", ")}`);
              }
              if (err.pricing_tiers) {
                formattedErrors.push("Please add at least one pricing tier");
              }
              if (err.unavailable_dates) {
                formattedErrors.push("Please check your unavailable dates");
              }
              if (err.product_type) {
                formattedErrors.push(`Product type: ${err.product_type}`);
              }
              if (err.category) {
                formattedErrors.push(`Category: ${err.category}`);
              }
              if (err.purchase_year) {
                formattedErrors.push(`Purchase year: ${err.purchase_year}`);
              }
            }

            if (formattedErrors.length > 0) {
              toast({
                title: "Validation Error",
                description: formattedErrors.join("\n"),
                variant: "destructive"
              });
              return Promise.reject(
                new Error(formattedErrors.join("\n"))
              );
            }
          }

          // Product status errors
          if (error.response.status === 403) {
            if (
              typeof errorData === "object" &&
              errorData !== null &&
              "detail" in errorData &&
              typeof (errorData as any).detail === "string" &&
              (errorData as any).detail.includes("status")
            ) {
              toast({
                title: "Status Error",
                description: "This action is not allowed in the current status",
                variant: "destructive"
              });
              return Promise.reject(
                new Error("This action is not allowed in the current status")
              );
            }
          }

          // Handle other API errors
          if (typeof errorData === "string") {
            toast({
              title: "Error",
              description: errorData,
              variant: "destructive"
            });
            return Promise.reject(new Error(errorData));
          } else if (
            typeof errorData === "object" &&
            errorData !== null &&
            "detail" in errorData
          ) {
            const err = errorData as { detail?: string };
            toast({
              title: "Error",
              description: err.detail ?? "An error occurred",
              variant: "destructive"
            });
            return Promise.reject(new Error(err.detail ?? "An error occurred"));
          } else if (
            typeof errorData === "object" &&
            errorData !== null &&
            "non_field_errors" in errorData
          ) {
            const err = errorData as { non_field_errors?: string[] };
            toast({
              title: "Error",
              description: err.non_field_errors?.[0] ?? "An error occurred",
              variant: "destructive"
            });
            return Promise.reject(new Error(err.non_field_errors?.[0] ?? "An error occurred"));
          } else if (
            typeof errorData === "object" &&
            errorData !== null &&
            "message" in errorData
          ) {
            const err = errorData as { message?: string };
            toast({
              title: "Error",
              description: err.message ?? "An error occurred",
              variant: "destructive"
            });
            return Promise.reject(new Error(err.message ?? "An error occurred"));
          } else if (
            typeof errorData === "object" &&
            errorData !== null &&
            "error" in errorData
          ) {
            const err = errorData as { error?: string };
            if (err.error) {
              return Promise.reject(new Error(err.error));
            }
          } else {
            const errorMessages = Object.entries(errorData)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            toast({
              title: "Validation Error",
              description: `Validation error: ${errorMessages}`,
              variant: "destructive"
            });
            return Promise.reject(
              new Error(`Validation error: ${errorMessages}`)
            );
          }
        }

        toast({
          title: "Network Error",
          description: "Network error. Please check your connection and try again.",
          variant: "destructive"
        });

        return Promise.reject(
          new Error(
            "Network error. Please check your connection and try again."
          )
        );
      }
    );
  }

  /**
   * Transform object keys from camelCase to snake_case
   */
  private transformToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformToSnakeCase(item));
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        const snakeKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`
        );
        acc[snakeKey] = this.transformToSnakeCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  /**
   * Transform object keys from snake_case to camelCase
   */
  private transformToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformToCamelCase(item));
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );
        acc[camelKey] = this.transformToCamelCase(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  }

  /**
   * Get singleton instance of ApiService
   */
  public static getInstance(): ApiService {
    if (!this.instance) {
      this.instance = new ApiService();
    }
    return this.instance;
  }

  /**
   * Get the configured axios instance
   */
  public getApi(): AxiosInstance {
    return this.api;
  }
}

// Export a singleton instance of the API service
export default ApiService.getInstance().getApi();