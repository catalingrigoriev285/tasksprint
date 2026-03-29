import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div style={styles.page}>
            <div style={styles.card}>{children}</div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: "24px",
    },
    card: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    },
};

export default AuthLayout;
