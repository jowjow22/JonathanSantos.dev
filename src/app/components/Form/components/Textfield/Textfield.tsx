import { textField } from './text-field.variants'

type ITextFieldProps = {
  type?: 'text' | 'long' | 'email' | 'password'
  label: string
  name: string
  error?: boolean
  errorMessage?: string
} & (
  | ({
      type?: 'text' | 'email' | 'password'
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({ type: 'long' } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
)

export const TextField = ({
  label,
  name,
  placeholder,
  type = 'text',
  error = false,
  errorMessage,
  ...rest
}: ITextFieldProps) => {
  const currentVariant = textField({ variant: error ? 'error' : 'default' })

  return (
    <div className="bg-inherit text-start flex flex-col gap-y-2">
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      {type === 'long' ? (
        <textarea
          name={name}
          id={name}
          className={currentVariant}
          autoComplete="off"
          placeholder={placeholder}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          className={currentVariant}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <span className="text-red-500 text-xs">
          {errorMessage || 'This field is required'}
        </span>
      )}
    </div>
  )
}
