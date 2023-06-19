interface Props {
  name: string;
  buttonClick: () => void;
}

export default function PrimaryButton({ name, buttonClick }: Props) {
  return (
    <button
      className=" min-w-[8rem] px-4 py-2 border-2 border-anzac-400 rounded-xl bg-anzac-400 text-white text-xs font-bold hover:cursor-pointer"
      onClick={buttonClick}
    >
      {name}
    </button>
  );
}
