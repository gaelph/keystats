import React, { useState } from "react";

interface TabProps {
  title?: string;
  children?: React.ReactNode;
  active?: boolean;
}

interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}

export function Tab({
  title: _title,
  children,
  active,
}: TabProps): React.ReactElement<TabProps> {
  return <li className={`tab ${active ? "active" : ""}`}>{children}</li>;
}

export function Tabs(props: TabsProps): React.ReactElement<TabsProps> | null {
  let { children } = props;
  const [activeTab, setActiveTab] = useState(0);

  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    children = [children];
  }

  const tabs = Array.from(children).map((child, idx) =>
    React.cloneElement(child, {
      active: idx === activeTab,
      key: `tab-${child.props.title}`,
    }),
  );

  return (
    <div className="tabs">
      <div className="tabs-button">
        {tabs.map((child, idx) => (
          <button
            key={child.props.title}
            className={`tab-button ${idx === activeTab ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(idx);
            }}
          >
            {idx === activeTab ? "• " : ""}
            {child.props.title}
          </button>
        ))}
      </div>

      <ul className="tabs-content">{tabs}</ul>
    </div>
  );
}
