# Legal Terms & Disclaimers

**LMAPP - Trial Period & Free Tier Terms**

Last Updated: December 11, 2025  
Version: LMAPP v0.4.0+

---

## 1. Trial Period Terms

### 1.1 Trial Duration
- Trial period is **30 days** from first installation
- Trial automatically **renews every 30 days** for testing and development purposes
- Trial renewal is indefinite during beta phase (v0.4.0+)

### 1.2 Trial Eligibility
- Available to all users upon installation
- Free of charge
- No payment method required
- No account registration required

### 1.3 Trial Restrictions
- **Intended Use:** Legitimate evaluation, testing, and development purposes only
- **Misuse:** Attempting to circumvent the trial system is prohibited:
  - Deleting trial tracker files to reset trial counter
  - Uninstalling and reinstalling to gain additional trial time
  - Attempting to modify trial configuration files
  - Any other method to exploit trial auto-renewal

**Consequence:** Users found circumventing the trial system may be restricted from future features, including paid tier access (when available).

---

## 2. Free Tier Terms

### 2.1 Scope
Free tier provides access to core LMAPP features indefinitely:
- Chat functionality (Ollama backend only)
- Command-line interface
- Basic system diagnostics

### 2.2 No Warranty
Free tier is provided **"AS IS"** without warranty or guarantee of service. We do not guarantee:
- Uptime or availability
- Performance or response time
- Feature stability
- Continued availability of free tier

### 2.3 Right to Modify
We reserve the right to:
- Change free tier features at any time
- Add, remove, or limit features
- Deprecate free tier functionality
- Introduce paid tier restrictions

Users are not entitled to compensation for feature changes.

---

## 3. Data & Privacy

### 3.1 Local Storage
Trial tracking data is stored **locally on your device only**:
- Location: `~/.lmapp/trial_tracker.json` (primary)
- Backup: `~/.lmapp_backup/trial_tracker.json`
- System: `/var/lmapp/trial_tracker.json` (Linux only)

### 3.2 Data Never Collected
During beta phase (v0.4.0+), LMAPP does **NOT**:
- Send trial data to servers
- Collect usage statistics
- Track user behavior
- Share data with third parties
- Require any form of authentication or account

**Note:** This may change when paid tier launches. You will be notified before any data collection begins.

### 3.3 Machine Identification
Trial tracking uses a local machine identifier generated from:
- System hostname
- MAC address hash

This identifier is **never** sent to servers and is used only for local trial persistence.

---

## 4. Feature Gating & Limitations

### 4.1 Intentional Limitations
Free tier features are intentionally limited. This is **not a bug**.

Limitations include:
- Single backend (Ollama)
- No RAG (document search)
- No plugins
- No batch processing
- No web UI

These restrictions are by design and may be updated without notice.

### 4.2 Advanced Mode
Advanced Mode is a feature flag controlling access to advanced features. We reserve the right to:
- Change which features require Advanced Mode
- Require authentication for Advanced Mode
- Restrict Advanced Mode availability
- Modify gating logic at any time

---

## 5. Liability & Disclaimers

### 5.1 No Warranty
LMAPP is provided **as-is** without any warranties, express or implied:
- No warranty of merchantability
- No warranty of fitness for particular purpose
- No warranty of non-infringement
- No warranty of accuracy, reliability, or completeness

### 5.2 Limitation of Liability
To the maximum extent permitted by law:
- We are not liable for any indirect, incidental, or consequential damages
- We are not liable for loss of data, revenue, or profits
- We are not liable for interruption of service
- We are not liable for any damages whatsoever, even if advised of possibility of such damages

### 5.3 User Responsibility
You are solely responsible for:
- Backup and recovery of your data
- Evaluation of LMAPP suitability for your use case
- Compliance with all applicable laws
- Consequences of using LMAPP

### 5.4 Third-Party Services
LMAPP may integrate with third-party services (Ollama, external LLM APIs, etc.). We are not responsible for:
- Third-party service reliability or availability
- Third-party service terms or policies
- Third-party service data handling
- Any issues arising from third-party integration

You are responsible for complying with third-party terms of service.

---

## 6. Acceptable Use

### 6.1 Permitted Use
You may use LMAPP for:
- Personal projects
- Commercial projects
- Educational purposes
- Open-source development
- Internal business use
- Any lawful purpose

### 6.2 Prohibited Use
You may NOT use LMAPP for:
- Illegal activities
- Harassment, discrimination, or hate speech
- Copyright infringement
- Unauthorized access to systems
- Creating malicious software
- Violating applicable laws

---

## 7. Intellectual Property

### 7.1 LMAPP License
LMAPP is released under the **MIT License**:
- You may use, modify, and distribute LMAPP
- You must include the MIT license notice
- We provide no warranties
- You assume all liability

See [LICENSE](./LICENSE) file for full MIT license text.

### 7.2 Your Content
You retain all rights to your content:
- Documents you upload to RAG
- Conversations with LMAPP
- Plugins you create
- Custom configurations

LMAPP makes no claims to your content.

---

## 8. Termination

### 8.1 Access Termination
We reserve the right to restrict or terminate your access to LMAPP if:
- You violate these terms
- You attempt to circumvent trial system
- You engage in prohibited use
- You violate applicable laws

### 8.2 No Compensation
Termination of access does not entitle you to:
- Refund (we charge no fees)
- Compensation
- Recovery of data
- Future feature access

---

## 9. Future Changes

### 9.1 Paid Tier Launch
When paid tier is introduced:
- Free tier will remain free (committed)
- Trial period may become time-limited (e.g., 30 days max)
- New terms of service may apply
- Pricing and plans will be clearly disclosed

### 9.2 Notice of Changes
Significant changes to these terms will be:
- Announced in release notes
- Updated in this document
- Notified to users (if contact info available)

---

## 10. Dispute Resolution

### 10.1 Governing Law
These terms are governed by the laws of **[Your Jurisdiction]** (to be specified).

### 10.2 Disputes
Any disputes arising from these terms or LMAPP use shall be:
- Resolved informally when possible
- Escalated to appropriate legal jurisdiction if necessary

### 10.3 No Class Actions
You may not bring class action, group action, or representative action against us.

---

## 11. Acknowledgment

By using LMAPP, you acknowledge that you have:
- Read these terms in their entirety
- Understand the limitations and disclaimers
- Accept the "as-is" nature of the software
- Assume all responsibility and liability for use
- Agree to all terms and conditions herein

---

## 12. Contact

For questions about these terms:
- **GitHub Issues:** [Report concern](https://github.com/nabaznyl/lmapp/issues)
- **Discussions:** [Ask question](https://github.com/nabaznyl/lmapp/discussions)
- **Email:** [Contact info - add as needed]

---

## Appendix A: Trial System Integrity

### A.1 Trial Circumvention Policy
The trial system is designed to be fair and honest:
- Honor system during beta (no DRM or heavy enforcement)
- Local-only tracking (no surveillance)
- Trust-based approach

However, **attempting to circumvent the trial system is a violation of these terms**, even during beta phase.

Examples of prohibited behavior:
- Deleting `trial_tracker.json` to reset counter
- Modifying tracker file timestamps
- Using multiple accounts to extend trial
- Uninstall/reinstall for additional trial time
- Script-based trial reset automation

### A.2 Beta Phase Exception
During beta (v0.4.0-v0.9.9), circumvention is discouraged but not heavily enforced. When v1.0.0 is released and paid tier launches, circumvention detection will be enabled.

### A.3 Good Faith Users
Good faith users are encouraged to:
- Report trial bugs
- Test edge cases
- Provide feedback
- Help improve LMAPP

We trust our community. Abuse of trust will result in restrictions.

---

**These terms are effective immediately and apply to LMAPP v0.4.0 and later.**

**For previous versions, see archived terms (if applicable).**
