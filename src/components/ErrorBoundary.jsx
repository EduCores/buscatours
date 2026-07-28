import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: "40px", 
          backgroundColor: "#0a0f1a", 
          color: "#fff", 
          minHeight: "100vh",
          fontFamily: "monospace"
        }}>
          <h1 style={{ color: "#ef4444" }}>❌ Error en la aplicación</h1>
          <p style={{ marginTop: "10px" }}>{this.state.error?.message || "Error desconocido"}</p>
          <pre style={{ 
            marginTop: "20px", 
            padding: "15px", 
            backgroundColor: "#111827", 
            borderRadius: "8px",
            fontSize: "12px",
            overflow: "auto"
          }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}