# automation

## Next Steps

- Remove create assistant functionality from `assistants\assistantChat.js`
- Add the list of assistants to the `AssistantPage`
- In order to reduce api costs, store messages in local state to avoid unnecessary API calls when the user clicks the "Resume chat" button
- Rerender page when adding and deleting threads as well as any other change that affects the UI
- The set up for adding images to messages is very convoluted and hacky, sending a base64 encoded image as the image_url would have things much simpler but it would have lead to very large payloads if the message thread contained multiple images
