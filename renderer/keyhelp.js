// Plain-language steps for getting an Anthropic API key. Shared by the Ask AI tab and Settings.
(function(){
const URL='https://platform.claude.com/settings/keys';
const steps=()=>`<ol class="kh">
 <li>Click <b>Open Anthropic Console</b> and sign in (or create an account).</li>
 <li>Add payment: open <b>Billing</b> in the Console and add a card or buy credits. The API is pay-as-you-go and separate from a Claude.ai chat subscription.</li>
 <li>On the <b>API Keys</b> page, click <b>Create Key</b>, name it “NurseDesk”, and <b>copy</b> the key. It starts with <code>sk-ant-</code> and is shown only once.</li>
 <li>Paste it here and click <b>Save key</b>.</li></ol>`;
const open=()=>api.openExternal(URL);
window.keyHelp={URL,steps,open};
})();
