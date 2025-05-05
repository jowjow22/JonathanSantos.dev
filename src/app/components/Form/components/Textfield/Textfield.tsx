interface ITextFieldProps {
  label: string
  name: string
  long?: boolean
}

export const TextField = ({ label, name, long }: ITextFieldProps) => {
  return (
    <div className="relative bg-inherit">
      {long ? (
        <textarea
          name={name}
          id={name}
          className="w-full border-2 rounded px-3 py-2 border-gray-600/50 peer placeholder-transparent focus:outline-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          id={name}
          className="w-full border-2 rounded px-3 py-2 border-gray-600/50 peer placeholder-transparent focus:outline-none"
        />
      )}
      <label
        htmlFor={name}
        className="absolute left-3 top-2 text-sm transition-all px-1
        peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
        peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:bg-inherit
        peer-focus:bg-inherit peer-focus:px-1 peer-focus:text-gray-400
        peer-focus:text-gray-400 peer-focus:font-normal
        peer-focus:bg-inherit peer-focus:border-gray-400
        peer-focus:border-gray-400 peer-focus:rounded
        peer-focus:transition-all"
      >
        {label}
      </label>
    </div>
  )
}