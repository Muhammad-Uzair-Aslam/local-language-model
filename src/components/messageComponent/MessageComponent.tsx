// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard';
// import { Message } from '../../hooks/useChat';

// interface MessageComponentProps {
//   message: Message;
//   role: 'user' | 'system';
// }

// interface ParsedMessage {
//   thinking: string;
//   mainContent: string;
//   codeBlocks: CodeBlock[];
// }

// interface CodeBlock {
//   language: string;
//   content: string;
// }

// export const MessageComponent: React.FC<MessageComponentProps> = ({ message, role }) => {
//   const [isThinkingVisible, setIsThinkingVisible] = useState(true);
//   const [parsedContent, setParsedContent] = useState<ParsedMessage>({ 
//     thinking: '', 
//     mainContent: '', 
//     codeBlocks: [] 
//   });
  
//   useEffect(() => {
//     setParsedContent(parseMessage(message.content));
//   }, [message.content]);

//   const copyToClipboard = async (text: string) => {
//     const parsed = parseMessage(text);
//     // Reconstruct the content without thinking part
//     let contentToCopy = parsed.mainContent;
    
//     // Add code blocks back in their original format
//     parsed.codeBlocks.forEach((block, index) => {
//       // Find the position to insert the code block
//       const parts = parsed.mainContent.split(/```.*?\n[\s\S]*?```/g);
//       const position = parts.slice(0, index + 1).join('').length;
      
//       // Insert the code block at the correct position
//       contentToCopy = [
//         contentToCopy.slice(0, position),
//         `\n\`\`\`${block.language}\n${block.content}\n\`\`\`\n`,
//         contentToCopy.slice(position)
//       ].join('');
//     });
    
//     await Clipboard.setString(contentToCopy.trim());
//   };

//   const parseMessage = (content: string): ParsedMessage => {
//     if (content.startsWith('<think>')) {
//       content = content.replace('<think>', '');
//       const parts = content.split('</think>');
      
//       if (parts.length > 1) {
//         return {
//           thinking: parts[0].trim(),
//           mainContent: parts[1].trim()
//             .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
//             .replace(/<｜end▁of▁sentence｜>/g, '')
//             .trim(),
//           codeBlocks: parseCodeBlocks(parts[1].trim())
//         };
//       } else {
//         return {
//           thinking: content
//             .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
//             .replace(/<｜end▁of▁sentence｜>/g, '')
//             .trim(),
//           mainContent: '',
//           codeBlocks: []
//         };
//       }
//     }
    
//     const mainContent = content
//       .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
//       .replace(/<｜end▁of▁sentence｜>/g, '')
//       .trim();
    
//     return {
//       thinking: '',
//       mainContent,
//       codeBlocks: parseCodeBlocks(mainContent)
//     };
//   };

//   const parseCodeBlocks = (content: string): CodeBlock[] => {
//     const codeBlocks: CodeBlock[] = [];
//     const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
//     let match;

//     while ((match = codeBlockRegex.exec(content)) !== null) {
//       codeBlocks.push({
//         language: match[1] || 'plaintext',
//         content: match[2].trim()
//       });
//     }

//     return codeBlocks;
//   };

//   // Rest of the component remains the same...
//   const { thinking, mainContent, codeBlocks } = parsedContent;

//   const renderContent = () => {
//     const parts = mainContent.split(/```.*?\n[\s\S]*?```/g);
//     const result = [];
    
//     for (let i = 0; i < parts.length; i++) {
//       if (parts[i].trim()) {
//         result.push(
//           <Text
//             key={`text-${i}`}
//             selectable={true}
//             style={[
//               styles.messageText,
//               role === 'user' ? styles.userMessageText : styles.botMessageText,
//             ]}>
//             {parts[i].trim()}
//           </Text>
//         );
//       }
//       if (codeBlocks[i]) {
//         result.push(
//           <View key={`code-${i}`} style={styles.codeBlockContainer}>
//             <View style={styles.codeBlockHeader}>
//               <Text style={styles.languageText}>{codeBlocks[i].language}</Text>
//               <TouchableOpacity 
//                 onPress={() => copyToClipboard(codeBlocks[i].content)}
//                 style={styles.copyButton}>
//                 <Text style={styles.copyButtonText}>Copy</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.codeBlock}>
//               <Text selectable={true} style={styles.codeText}>
//                 {codeBlocks[i].content}
//               </Text>
//             </View>
//           </View>
//         );
//       }
//     }
//     return result;
//   };

//   return (
//     <View
//       style={[
//         styles.messageContainer,
//         role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
//       ]}>
//       <TouchableOpacity 
//         style={styles.messageTouchable}
//         onLongPress={() => copyToClipboard(message.content)}>
//         {thinking && (
//           <>
//             <TouchableOpacity
//               onPress={() => setIsThinkingVisible(!isThinkingVisible)}
//               style={styles.thinkingHeader}>
//               <Text selectable={true} style={styles.thinkingHeaderText}>
//                 {isThinkingVisible ? '▼' : '▶'} Thinking Process
//               </Text>
//             </TouchableOpacity>
//             {isThinkingVisible && (
//               <View style={styles.thinkingContainer}>
//                 <Text 
//                   selectable={true} 
//                   style={[
//                     styles.messageText, 
//                     styles.thinkingText,
//                     role === 'user' ? styles.userThinkingText : styles.botThinkingText
//                   ]}>
//                   {thinking}
//                 </Text>
//               </View>
//             )}
//           </>
//         )}
//         {renderContent()}
//       </TouchableOpacity>
//       <Text style={[styles.timeText, role === 'user' ? styles.userTimeText : styles.botTimeText]}>
//         {new Date().toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         })}
//       </Text>
//     </View>
//   );
// };
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Message } from '../../hooks/useChat';

interface MessageComponentProps {
  message: Message;
  role: 'user' | 'system';
}

interface ParsedMessage {
  thinking: string;
  mainContent: string;
  codeBlocks: CodeBlock[];
}

interface CodeBlock {
  language: string;
  content: string;
}

export const MessageComponent: React.FC<MessageComponentProps> = ({ message, role }) => {
  const [isThinkingVisible, setIsThinkingVisible] = useState(true);
  const [parsedContent, setParsedContent] = useState<ParsedMessage>({ 
    thinking: '', 
    mainContent: '', 
    codeBlocks: [] 
  });
  
  useEffect(() => {
    setParsedContent(parseMessage(message.content));
  }, [message.content]);

  const copyToClipboard = async (text: string) => {
    await Clipboard.setString(text);
  };

  const parseMessage = (content: string): ParsedMessage => {
    if (content.startsWith('<think>')) {
      // Remove just the opening tag
      content = content.replace('<think>', '');
      // Split content at closing tag if it exists
      const parts = content.split('</think>');
      
      if (parts.length > 1) {
        // If closing tag found
        return {
          thinking: parts[0].trim(),
          mainContent: parts[1].trim()
            .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
            .replace(/<｜end▁of▁sentence｜>/g, '')
            .trim(),
          codeBlocks: parseCodeBlocks(parts[1].trim())
        };
      } else {
        // If no closing tag, treat everything as thinking
        return {
          thinking: content
            .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
            .replace(/<｜end▁of▁sentence｜>/g, '')
            .trim(),
          mainContent: '',
          codeBlocks: []
        };
      }
    }
    
    // If no think tag at start, everything is main content
    const mainContent = content
      .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
      .replace(/<｜end▁of▁sentence｜>/g, '')
      .trim();
    
    return {
      thinking: '',
      mainContent,
      codeBlocks: parseCodeBlocks(mainContent)
    };
  };

  const parseCodeBlocks = (content: string): CodeBlock[] => {
    const codeBlocks: CodeBlock[] = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'plaintext',
        content: match[2].trim()
      });
    }

    return codeBlocks;
  };

  const { thinking, mainContent, codeBlocks } = parsedContent;

  const renderContent = () => {
    const parts = mainContent.split(/```.*?\n[\s\S]*?```/g);
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].trim()) {
        result.push(
          <Text
            key={`text-${i}`}
            selectable={true}
            style={[
              styles.messageText,
              role === 'user' ? styles.userMessageText : styles.botMessageText,
            ]}>
            {parts[i].trim()}
          </Text>
        );
      }
      if (codeBlocks[i]) {
        result.push(
          <View key={`code-${i}`} style={styles.codeBlockContainer}>
            <View style={styles.codeBlockHeader}>
              <Text style={styles.languageText}>{codeBlocks[i].language}</Text>
              <TouchableOpacity 
                onPress={() => copyToClipboard(codeBlocks[i].content)}
                style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.codeBlock}>
              <Text selectable={true} style={styles.codeText}>
                {codeBlocks[i].content}
              </Text>
            </View>
          </View>
        );
      }
    }
    return result;
  };

  return (
    <View
      style={[
        styles.messageContainer,
        role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
      ]}>
      <TouchableOpacity 
        style={styles.messageTouchable}
        onLongPress={() => copyToClipboard(message.content)}>
        {thinking && (
          <>
            <TouchableOpacity
              onPress={() => setIsThinkingVisible(!isThinkingVisible)}
              style={styles.thinkingHeader}>
              <Text selectable={true} style={styles.thinkingHeaderText}>
                {isThinkingVisible ? '▼' : '▶'} Thinking Process
              </Text>
            </TouchableOpacity>
            {isThinkingVisible && (
              <View style={styles.thinkingContainer}>
                <Text 
                  selectable={true} 
                  style={[
                    styles.messageText, 
                    styles.thinkingText,
                    role === 'user' ? styles.userThinkingText : styles.botThinkingText
                  ]}>
                  {thinking}
                </Text>
              </View>
            )}
          </>
        )}
        {renderContent()}
      </TouchableOpacity>
      <Text style={[styles.timeText, role === 'user' ? styles.userTimeText : styles.botTimeText]}>
        {new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '85%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 20,
  },
  messageTouchable: {
    width: '100%',
  },
  thinkingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thinkingHeaderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  thinkingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  userThinkingText: {
    color: '#e3f2fd',
  },
  botThinkingText: {
    color: '#666',
  },
  thinkingText: {
    fontStyle: 'italic',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a237e',
    borderBottomRightRadius: 4,
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#FFF',
  },
  botMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: '#FFF',
    opacity: 0.8,
  },
  botTimeText: {
    color: '#666',
  },
  codeBlockContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1e1e1e',
  },
  codeBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#333',
  },
  languageText: {
    color: '#fff',
    fontSize: 12,
  },
  copyButton: {
    backgroundColor: '#444',
    padding: 4,
    borderRadius: 4,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  codeBlock: {
    padding: 12,
  },
  codeText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
  },
});
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Clipboard from '@react-native-clipboard/clipboard';
// import { Message } from '../../hooks/useChat';

// interface MessageComponentProps {
//   message: Message;
//   role: 'user' | 'system';
// }

// interface ParsedMessage {
//   thinking: string;
//   mainContent: string;
// }

// export const MessageComponent: React.FC<MessageComponentProps> = ({ message, role }) => {
//   const [isThinkingVisible, setIsThinkingVisible] = useState(true);
  
//   const copyToClipboard = async (text: string) => {
//     const { thinking, mainContent } = parseMessage(text);
//     const cleanContent = mainContent
//       .replace(/😊<\|end[_\s]of[_\s]sentence\|>/gi, '')
//       .replace(/😊<｜end▁of▁sentence｜>/g, '')
//       .trim();
//     await Clipboard.setString(cleanContent);
//   };

//   const parseMessage = (content: string): ParsedMessage => {
//     const thinkMatch = content.match(/<think>(.*?)<\/think>/s);
//     const thinking = thinkMatch ? thinkMatch[1] : '';
//     let mainContent = content.replace(/<think>.*?<\/think>/s, '').trim();
//     mainContent = mainContent
//       .replace(/<\|end[_\s]of[_\s]sentence\|>/gi, '')
//       .replace(/<｜end▁of▁sentence｜>/g, '')
//       .trim();
//     return { thinking, mainContent };
//   };

//   const { thinking, mainContent } = parseMessage(message.content);

//   return (
//     <View
//       style={[
//         styles.messageContainer,
//         role === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
//       ]}>
//       <TouchableOpacity 
//         style={styles.messageTouchable}
//         onLongPress={() => copyToClipboard(message.content)}>
//         {thinking && (
//           <TouchableOpacity
//             onPress={() => setIsThinkingVisible(!isThinkingVisible)}
//             style={styles.thinkingHeader}>
//             <Text selectable={true} style={styles.thinkingHeaderText}>
//               {isThinkingVisible ? '▼' : '▶'} Thinking
//             </Text>
//           </TouchableOpacity>
//         )}
//         {thinking && isThinkingVisible && (
//           <View style={styles.thinkingContainer}>
//             <Text style={[styles.messageText, styles.thinkingText]}>
//               {thinking}
//             </Text>
//           </View>
//         )}
//         <Text
//           style={[
//             styles.messageText,
//             role === 'user' ? styles.userMessageText : styles.botMessageText,
//           ]}>
//           {mainContent}
//         </Text>
//       </TouchableOpacity>
//       <Text style={[styles.timeText, role === 'user' ? styles.userTimeText : styles.botTimeText]}>
//         {new Date().toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         })}
//       </Text>
//     </View>
//   );
// };
// export const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#F5F7FB',
//     },
//     header: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: 16,
//       backgroundColor: '#1a237e',
//       elevation: 4,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//     },
//     headerTitle: {
//       fontSize: 24,
//       fontWeight: '700',
//       color: '#FFF',
//       letterSpacing: 1,
//     },
//     messageList: {
//       padding: 12,
//     },
//     messageContainer: {
//       maxWidth: '85%',
//       marginVertical: 8,
//       padding: 12,
//       borderRadius: 20,
//     },
//     messageTouchable: {
//       width: '100%',
//     },
//     thinkingHeader: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 8,
//     },
//     thinkingHeaderText: {
//       fontSize: 14,
//       color: '#666',
//       fontWeight: '600',
//     },
//     thinkingContainer: {
//       backgroundColor: 'rgba(0, 0, 0, 0.05)',
//       padding: 8,
//       borderRadius: 8,
//       marginBottom: 8,
//     },
//     thinkingText: {
//       fontStyle: 'italic',
//       color: '#666',
//     },
//     tokenInput: {
//       paddingHorizontal: 12,
//       paddingVertical: 8,
//       borderWidth: 1,
//       borderColor: '#ddd',
//       padding: 10,
//       borderRadius: 20,
//     },
//     userMessageContainer: {
//       alignSelf: 'flex-end',
//       backgroundColor: '#1a237e',
//       borderBottomRightRadius: 4,
//     },
//     botMessageContainer: {
//       alignSelf: 'flex-start',
//       backgroundColor: '#FFF',
//       borderBottomLeftRadius: 4,
//     },
//     messageText: {
//       fontSize: 16,
//       lineHeight: 24,
//     },
//     userMessageText: {
//       color: '#FFF',
//     },
//     botMessageText: {
//       color: '#333',
//     },
//     timeText: {
//       fontSize: 11,
//       marginTop: 4,
//       alignSelf: 'flex-end',
//     },
//     userTimeText: {
//       color: '#FFF',
//       opacity: 0.8,
//     },
//     botTimeText: {
//       color: '#666',
//     },
//     inputContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingHorizontal: 12,
//       paddingVertical: 10,
//       backgroundColor: '#FFF',
//       borderTopWidth: 1,
//       borderTopColor: '#E5E5E5',
//     },
//     inputWrapper: {
//       flex: 1,
//       backgroundColor: '#F5F7FB',
//       borderRadius: 25,
//       paddingHorizontal: 16,
//       paddingVertical: 8,
//       marginRight: 12,
//       borderWidth: 1,
//       borderColor: '#E5E5E5',
//     },
//     input: {
//       fontSize: 16,
//       color: '#333',
//       maxHeight: 100,
//     },
//     sendButton: {
//       backgroundColor: '#1a237e',
//       borderRadius: 25,
//       paddingHorizontal: 20,
//       paddingVertical: 12,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     sendButtonDisabled: {
//       backgroundColor: '#B0C4DE',
//     },
//     sendButtonText: {
//       color: '#FFF',
//       fontSize: 16,
//       fontWeight: '600',
//     },
//   });