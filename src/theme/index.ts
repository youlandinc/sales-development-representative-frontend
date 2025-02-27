'use client';
import { CSSProperties } from 'react';
import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
    xxxl: true;
  }

  interface Palette {
    border: TypeBorder;
    boxShadow: TypeBoxShadow;
  }

  interface PaletteOptions {
    border?: TypeBorder;
    boxShadow?: TypeBoxShadow;
  }

  interface PaletteColor {
    darker?: string;
    darkest?: string;
    lighter?: string;
    lightest?: string;
    hover?: string;
    background?: string;
    contrastHover?: string;
    contrastBackground?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
    darkest?: string;
    lighter?: string;
    lightest?: string;
    hover?: string;
    background?: string;
    contrastHover?: string;
    contrastBackground?: string;
  }

  interface TypeText {
    default: string;
    disabled: string;
    hover: string;
    focus: string;
    primary: string;
    secondary: string;
  }

  interface TypeBorder {
    default: string;
    disabled: string;
    hover: string;
    focus: string;
    primary: string;
    secondary: string;
  }

  interface TypeBackground {
    default: string;
    disabled: string;
    hover: string;
    focus: string;
    primary: string;
    secondary: string;
  }

  interface TypeBoxShadow {
    card: string;
    dropdown: string;
    button: string;
  }

  interface TypographyVariants {
    body3: CSSProperties;
    subtitle3: CSSProperties;
    h7: CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: CSSProperties;
    subtitle3?: CSSProperties;
    h7?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subtitle3: true;
    h7: true;
  }
}

const customBreakpoints = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 431,
      md: 768,
      lg: 1024,
      xl: 1200,
      xxl: 1440,
      xxxl: 1920,
    },
  },
});

const defaultOptions: ThemeOptions = {
  ...customBreakpoints,
  palette: {
    primary: {
      main: '#5B76BC',
      hover: '#4B6BB6',
      background: '#EFF1F8',
      light: '#EDF1FF',
      lighter: '#F4F6FA',
      dark: '#7D9DE8',
      darker: '#3A5290',
      contrastText: '#FFFFFF',
      contrastHover: '#2B52B6',
      contrastBackground: '#6E4EFB',
    },
    secondary: {
      main: '#FFFFFF',
      hover: '#F4F6FA',
      background: 'rgba(255,255,255,.1)',
      contrastText: '#5B76BC',
    },
    info: {
      main: '#9095A3',
      hover: '#81889B',
      background: '#F4F4F6',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#69C0A5',
      hover: '#43A788',
      background: '#F0F9F6',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#EEB94D',
      hover: '#E39F15',
      background: '#FFF7E6',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DE6449',
      hover: '#CD5135',
      background: '#FFEEEA',
      contrastText: '#FFFFFF',
    },

    text: {
      default: '#333333',
      disabled: '#BABCBE',
      hover: '#5B76BC',
      focus: '#5B76BC',
      primary: '#333333',
      secondary: '#5B76BC',

      //primary: '#202939',
      //secondary: '#6F6C7D',
      //hover: '#636A7C',
      //disabled: '#BABCBE',
      //white: '#FFFFFF',
      //focus: '#202939',
    },
    background: {
      default: '#FFFFFF',
      disabled: '#BABCBE',
      hover: '#5B76BC',
      focus: '#5B76BC',
      primary: '#333333',
      secondary: '#5B76BC',

      //white: '#FFFFFF',
      //homepage: '#F4F6FA',
      //footer: '#121214',
      //main: '#5B76BC',
      //babyBlue: '#303D6C',
      //skyBlue: '#3C538F',
      //faq: '#F8F9FC',
    },
    border: {
      default: '#333333',
      disabled: '#BABCBE',
      hover: '#5B76BC',
      focus: '#5B76BC',
      primary: '#333333',
      secondary: '#5B76BC',

      //normal: '#D2D6E1',
      //hover: '#9095A3',
      //focus: '#202939',
      //disabled: '#BABCBE',
    },
    boxShadow: {
      card: '0px 0px 10px 0px rgba(17, 52, 227, 0.20)',
      dropdown:
        '0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
      button: '0px 1px 2px 0px rgba(52, 50, 62, 0.15)',
    },
  },
  typography: {
    fontFamily: 'var(--font-poppins)',
    h1: {
      fontSize: 56,
      fontWeight: 600,
    },
    h2: {
      fontSize: 48,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h3: {
      fontSize: 40,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h4: {
      fontSize: 32,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h5: {
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h6: {
      fontSize: 20,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h7: {
      fontSize: 18,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle3: {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body3: {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#9095A3',
          '.Mui-selected': {
            color: 'primary.main',
          },
        },
      },
    },
  },
};

// Create a theme instance.
const lightTheme = createTheme({ ...defaultOptions, cssVariables: true });

const darkTheme = createTheme({
  ...defaultOptions,
  palette: {
    ...defaultOptions.palette,
    primary: {
      main: 'rgba(60, 83, 143, 1)',
      hover: '#4B6BB6',
      background: '#EFF1F8',
      light: '#EDF1FF',
      lighter: '#F4F6FA',
      dark: '#7D9DE8',
      darker: '#3A5290',
      contrastText: '#FFFFFF',
      contrastHover: '#2B52B6',
      contrastBackground: '#365EC6',
    },
    background: {
      ...defaultOptions.palette?.background,
    },
  },
});

export { lightTheme, darkTheme };
