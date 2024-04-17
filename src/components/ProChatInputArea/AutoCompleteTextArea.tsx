﻿import { MentionProps, Mentions } from 'antd';
import { useState } from 'react';

/**
 * Props for the MentionsTextArea component.
 */
export type MentionsTextAreaProps = MentionProps & {
  /**
   * A function that is called when a mention is requested.
   * @param value - The value of the mention.
   * @returns A promise that resolves to an array of mention objects.
   */
  mentionRequest?: (value: string) => Promise<{ value: string; label?: string }[]>;
};

/**
 * A component that provides a textarea with mention functionality.
 * It allows users to mention other users by typing "@" followed by their name.
 *
 * @component
 * @example
 * ```tsx
 * <MentionsTextArea
 *   disabled={false}
 *   mentionRequest={fetchMentions}
 *   className="mentions-textarea"
 *   onChange={handleInputChange}
 *   onPressEnter={handleEnterPress}
 *   style={{ width: '100%' }}
 * />
 * ```
 */
export const MentionsTextArea: React.FC<MentionsTextAreaProps> = (props) => {
  const { disabled, mentionRequest, ...rest } = props;

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  return (
    <Mentions
      className={props.className}
      options={options}
      disabled={disabled}
      onSelect={(value) => {
        props.onChange?.({ target: { value } } as any);
        setOptions([]);
      }}
      prefix="/"
      {...rest}
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        outline: 'none',
        boxShadow: 'none',
        padding: '0 8px',
        margin: 0,
        border: 'none',
        ...rest.style,
      }}
      autoSize={{
        minRows: 3,
      }}
      onSearch={async (value, prefix) => {
        const result = await mentionRequest?.(value);
        setOptions((result as any[]) || []);
        rest?.onSearch?.(value, prefix);
      }}
      onPressEnter={(e) => {
        if (open && options.length > 0) return;
        props.onPressEnter?.(e);
      }}
    />
  );
};
