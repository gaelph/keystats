import React, { useState } from "react";

import "./Tabs.module.css";

interface TabProps {
  title?: string;
  children?: React.ReactNode;
  active?: boolean;
}

interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}

export function Tab({
  title,
  children,
  active,
}: TabProps): React.ReactElement<TabProps> {
  return (
    <li role="tabpanel" aria-labelledby={`tab-${title}`} hidden={!active}>
      {children}
    </li>
  );
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
    <>
      <div role="tablist" aria-label="Statistics Tabs">
        {tabs.map((child, idx) => (
          <button
            role="tab"
            aria-label={child.props.title}
            aria-selected={idx === activeTab}
            key={child.props.title}
            id={`tab-${child.props.title}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(idx);
            }}
          >
            {child.props.title}
          </button>
        ))}
      </div>

      <ul>{tabs}</ul>
    </>
  );
}
