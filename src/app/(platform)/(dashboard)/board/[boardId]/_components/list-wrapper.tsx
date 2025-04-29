"use client";

type ListWrapperProps = {
    children: React.ReactNode;
}

const ListWrapper = ({ children }: ListWrapperProps) => {
    return <li className="shrink-0 basis-80 grow-0 h-full w-[272px] select-none">
        {children}
    </li>;
};

export default ListWrapper;
