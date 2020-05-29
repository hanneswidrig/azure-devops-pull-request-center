export interface IColor {
  red: number;
  blue: number;
  green: number;
}

/**
 * My color system
 */
type TColors = Record<'green' | 'blue' | 'orange' | 'red', Record<'primary' | 'light', string>>;
export const Colors: TColors = {
  green: { primary: 'rgb(36, 161, 72)', light: 'rgb(231, 242, 231)' },
  blue: { primary: 'rgb(0, 120, 212)', light: 'rgb(218, 227, 243)' },
  orange: { primary: 'rgb(235, 121, 8)', light: 'rgb(255, 249, 230)' },
  red: { primary: 'rgb(218, 30, 40)', light: 'rgb(250, 235, 235)' },
};

export const reviewerVoteToColorsPrimary = (vote: number | string) => {
  const colorMap: Record<string, string> = {
    '10': Colors.green.primary,
    '5': Colors.green.primary,
    '0': Colors.blue.primary,
    '-5': Colors.orange.primary,
    '-10': Colors.red.primary,
  };
  return colorMap[vote];
};

export const reviewerVoteToColorsLight = (vote: number | string) => {
  const colorMap: Record<string, string> = {
    '10': Colors.green.light,
    '5': Colors.green.light,
    '0': Colors.blue.light,
    '-5': Colors.orange.light,
    '-10': Colors.red.light,
  };
  return colorMap[vote];
};

/**
 * Microsoft's Color Model for components
 */
export const approvedLightColor: IColor = {
  red: 231,
  green: 242,
  blue: 231,
};

export const approvedWithSuggestionsLightColor: IColor = {
  red: 231,
  green: 242,
  blue: 231,
};

export const noVoteLightColor: IColor = {
  red: 218,
  green: 227,
  blue: 243,
};

export const waitingAuthorLightColor: IColor = {
  red: 255,
  green: 249,
  blue: 230,
};

export const rejectedLightColor: IColor = {
  red: 250,
  green: 235,
  blue: 235,
};

export const reviewerVoteToIColorLight = (vote: number | string) => {
  const colorMap: Record<string, IColor> = {
    '10': approvedLightColor,
    '5': approvedWithSuggestionsLightColor,
    '0': noVoteLightColor,
    '-5': waitingAuthorLightColor,
    '-10': rejectedLightColor,
  };
  return colorMap[vote];
};
