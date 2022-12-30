import { string } from '@ioc:Adonis/Core/Helpers';

type Option = {
  value: string;
  label: string;
};

type OptionArgument = {
  [key: string]: string;
};

export function objectToOption(args: OptionArgument): Option[] {
  return Object.keys(args).map((arg) => ({
    label: string.capitalCase(arg),
    value: args[arg],
  }));
}
