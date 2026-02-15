import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";
import { useTheme } from "@core/util/Theme/ThemeContext";
import { useFont } from "@core/util/fonts/FontContext";
import type { Shade } from "@core/util/fonts";

export type TypoVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface TypographyProps {
    children: React.ReactNode;
    variant?: TypoVariant;
    size?: number;
    lineHeight?: number;
    weight?: TextStyle["fontWeight"];
    textAlign?: TextStyle["textAlign"];
    // choose theme token or pass explicit color
    themeToken?: "text01" | "text02";
    themeShade?: Shade | number; // NEW: allow callers to control shade passed to theme functions
    color?: string;
    style?: StyleProp<TextStyle>;
    testID?: string;
    // allow manual fontFamily override if needed
    fontFamily?: string;
    // control how many lines to display and truncation behaviour
    numberOfLines?: number;
    ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

/**
 * Typography - single implementation for H1..H6 and paragraph.
 * Presets chosen so H1..P follow standard scale; callers can override size/lineHeight/color/testID/style.
 */
const PRESETS: Record<TypoVariant, { size: number; lineHeight: number; weight?: TextStyle["fontWeight"]; token?: "text01" | "text02" }> = {
    h1: { size: 36, lineHeight: 45, weight: "700", token: "text01" },
    h2: { size: 30, lineHeight: 40, weight: "700", token: "text01" },
    h3: { size: 28, lineHeight: 34, weight: "700", token: "text01" },
    h4: { size: 20, lineHeight: 32, weight: "700", token: "text01" },
    h5: { size: 16, lineHeight: 24, weight: "700", token: "text01" },
    h6: { size: 14, lineHeight: 20, weight: "700", token: "text01" },
    p: { size: 12, lineHeight: 20, weight: "400", token: "text01" },
};

/**
 * Map font weight to Inter font family
 * React Native on iOS/Android requires explicit font family names for weights
 */
const getFontFamilyForWeight = (baseFamily: string | undefined, weight: TextStyle["fontWeight"]): string | undefined => {
    if (!baseFamily) return undefined;
    
    // If a specific Inter font is already provided, use it
    if (baseFamily.includes('Inter_')) return baseFamily;
    
    // Map numeric/string weights to Inter font families
    switch (weight) {
        case "100":
        case 100:
            return "Inter_18pt-Thin";
        case "200":
        case 200:
            return "Inter_18pt-ExtraLight";
        case "300":
        case 300:
            return "Inter_18pt-Light";
        case "normal":
        case "400":
        case 400:
            return "Inter_18pt-Regular";
        case "500":
        case 500:
            return "Inter_18pt-Medium";
        case "600":
        case 600:
            return "Inter_18pt-SemiBold";
        case "bold":
        case "700":
        case 700:
            return "Inter_18pt-Bold";
        case "800":
        case 800:
            return "Inter_18pt-ExtraBold";
        case "900":
        case 900:
            return "Inter_18pt-Black";
        default:
            return "Inter_18pt-Regular";
    }
};

export const Typography = ({
    children,
    variant = "h1",
    size,
    lineHeight,
    weight,
    textAlign = "center",
    themeToken,
    themeShade, // added prop
    color,
    style,
    testID,
    fontFamily,
    numberOfLines,
    ellipsizeMode,
}: TypographyProps) => {
    const theme: any = useTheme();
    const font = useFont();

    const preset = PRESETS[variant] || PRESETS.h1;

    const fontSize = size ?? preset.size;
    const computedLineHeight = lineHeight ?? preset.lineHeight;
    const fontWeight = weight ?? preset.weight ?? "400";

    // resolve theme color token
    let themeColor: string | undefined;
    const tokenToUse = themeToken ?? preset.token ?? "text01";
    const shadeToUse = typeof themeShade !== "undefined" ? themeShade : 100; // default 100 if not provided

    if (tokenToUse === "text02") {
        themeColor = typeof theme.text02 === "function" ? theme.text02(shadeToUse) : undefined;
    } else {
        themeColor = typeof theme.text01 === "function" ? theme.text01(shadeToUse) : undefined;
    }

    const resolvedColor = color ?? themeColor ?? "#000";

    // Use provided fontFamily, or map weight to appropriate Inter font, or fall back to font.regular
    const baseFontFamily = fontFamily ?? font?.regular ?? "Inter_18pt-Regular";
    const resolvedFontFamily = getFontFamilyForWeight(baseFontFamily, fontWeight);

    return (
        <Text
            {...(testID ? { testID } : {})}
            {...(typeof numberOfLines === "number" ? { numberOfLines } : {})}
            {...(ellipsizeMode ? { ellipsizeMode } : {})}
            style={[
                styles.base,
                {
                    fontSize,
                    lineHeight: computedLineHeight,
                    textAlign,
                    color: resolvedColor,
                    fontWeight,
                    fontFamily: resolvedFontFamily,
                } as TextStyle,
                style,
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        // minimal base; all specifics are applied inline so callers can override
    } as TextStyle,
});

