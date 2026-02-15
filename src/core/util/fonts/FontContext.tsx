import React, { createContext, useContext, ReactNode } from "react";
import type { Font } from "./FontConfig";

// Minimal default font config so components can safely read font families
const defaultFont: Font = {
    regular: "Inter_18pt-Regular",
    bold: "Inter_18pt-Bold",
    semiBold: "Inter_18pt-SemiBold",
    medium: "Inter_18pt-Medium",
    light: "Inter_18pt-Light",
    extraLight: "Inter_18pt-ExtraLight",
    thin: "Inter_18pt-Thin",
    extraBold: "Inter_18pt-ExtraBold",
    italic: "Inter_18pt-Italic",
    boldItalic: "Inter_18pt-BoldItalic",
    semiBoldItalic: "Inter_18pt-SemiBoldItalic",
    mediumItalic: "Inter_18pt-MediumItalic",
    lightItalic: "Inter_18pt-LightItalic",
    extraLightItalic: "Inter_18pt-ExtraLightItalic",
    thinItalic: "Inter_18pt-ThinItalic",
    extraBoldItalic: "Inter_18pt-ExtraBoldItalic",
    size: {
        XXXXS: 8,
        XXXS: 10,
        XXS: 11,
        XS: 12,
        S: 14,
        M: 16,
        L: 18,
        X: 20,
        XXL: 24,
        XXXL: 32,
    },
};

const FontContext = createContext<Font>(defaultFont);

export const FontProvider = ({ children, font = defaultFont }: { children: ReactNode; font?: Font }) => {
    return <FontContext.Provider value={font}>{children}</FontContext.Provider>;
};

export const useFont = (): Font => {
    return useContext(FontContext);
};

export default FontContext;
