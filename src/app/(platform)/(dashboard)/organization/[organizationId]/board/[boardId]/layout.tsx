import React from "react";

interface BoardLayoutProps {
    children: React.ReactNode;
    params: {
        organizationId: string;
        boardId: string;
    };
}

const BoardLayout = ({ children }: BoardLayoutProps) => {
    return (
        <div className="relative h-full">
            {children}
        </div>
    );
};

export default BoardLayout; 