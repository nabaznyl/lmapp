# Privacy Policy

**LMAPP Privacy & Data Handling**

Last Updated: December 11, 2025  
Version: LMAPP v0.4.0+

---

## Overview

LMAPP prioritizes your privacy. **We collect minimal data, store everything locally, and never share information with third parties.**

---

## What Data We Collect

### During Installation & Use

**Collected:**
- Machine identifier (hostname + MAC address hash) for trial tracking
- Trial state (start date, renewal count, status)

**Not Collected:**
- ❌ Personal information (name, email, location)
- ❌ Usage statistics
- ❌ Chat history or conversations
- ❌ Document content (RAG files)
- ❌ Configuration details
- ❌ System information
- ❌ IP addresses or network data

---

## Where Data is Stored

### Local Storage Only (Beta Phase v0.4.0+)

All trial tracking data is stored **exclusively on your device:**

```
Primary:   ~/.lmapp/trial_tracker.json
Backup:    ~/.lmapp_backup/trial_tracker.json
System:    /var/lmapp/trial_tracker.json (Linux only)
```

**Data never leaves your machine.**

### Trial Tracker Contents

The tracker file contains:
```json
{
  "trial_id": "hash(hostname + mac_address)",
  "start_date": "2025-12-11",
  "renewal_count": 0,
  "last_renewal": "2025-12-11",
  "status": "active",
  "version": 1
}
```

- **No personally identifiable information**
- **No timestamps we can't see**
- **No encrypted secrets**
- **Plain JSON for transparency**

---

## What We NEVER Do

- ❌ Send data to remote servers (currently)
- ❌ Track your usage behavior
- ❌ Monitor your conversations
- ❌ Access your documents
- ❌ Collect personal information
- ❌ Share data with third parties
- ❌ Sell or monetize your data
- ❌ Require account registration
- ❌ Use cookies or tracking pixels

---

## Future Changes (Paid Tier)

When paid subscription tier launches:

### Data Collected Will Include:
- Email address (for subscription management)
- Payment information (via Stripe - we don't store this)
- Subscription tier and renewal date
- Login timestamps

### Data NOT Collected Even Then:
- Chat conversations
- Documents uploaded to RAG
- Personal usage patterns
- Behavioral analytics

### You Will Be Notified:
- Privacy policy updated before any changes
- Clear opt-in required for data collection
- New features explained before launch

---

## Third-Party Services

### LMAPP Core
- Open source
- No external dependencies for data
- All processing local

### Optional Integrations
If you connect to external LLM services:
- **Ollama:** Local, no data leaves your machine
- **OpenAI, Anthropic, Mistral, etc.:** Subject to their privacy policies
- **We transmit only:** Your prompt text (necessary for inference)
- **We don't transmit:** Personal information, trial data, or any metadata

You are responsible for understanding each service's privacy policy.

---

## Data Security

### Local Storage Security
- Trial tracker stored in user home directory
- Standard file permissions apply
- Backup location hidden (dot folder)
- System location requires elevated permissions (Linux)

### No Encryption (Current)
- Trial tracker stored as plain JSON for transparency
- This will be reconsidered if server-side validation is added

### Recommendations
- Keep LMAPP updated (when updates available)
- Use standard OS security practices
- Don't share system access with untrusted users
- Review file permissions periodically

---

## Your Rights

### Access Your Data
You can access all data LMAPP collects:
```bash
cat ~/.lmapp/trial_tracker.json
```

### Delete Your Data
You can delete trial tracking completely:
```bash
rm ~/.lmapp/trial_tracker.json
rm ~/.lmapp_backup/trial_tracker.json
rm -r ~/.lmapp_backup/  # Entire backup
```

After deletion, next run creates new tracker (new trial begins).

### Opt-Out
You can disable data collection by:
- Deleting tracker files (described above)
- Not installing LMAPP
- Using LMAPP offline (no data sent)

---

## Data Deletion

### Automatic Cleanup
LMAPP does not automatically delete data. The trial tracker persists across:
- Updates
- Uninstalls
- Years of inactivity

**You control deletion.**

### Manual Deletion
```bash
# Delete trial data
rm ~/.lmapp/trial_tracker.json
rm ~/.lmapp_backup/trial_tracker.json

# Delete all LMAPP data
rm -rf ~/.lmapp
rm -rf ~/.lmapp_backup
rm -rf ~/.local/share/lmapp/  # Configuration & cache
```

---

## GDPR & Privacy Regulations

### GDPR Compliance (EU)
- No personal data collected ✓
- No processing of personal data ✓
- No need for data processing agreements ✓
- Right to access data (you can view trial tracker) ✓
- Right to delete data (you can delete trial tracker) ✓

**LMAPP is GDPR compliant by design** (minimal data = minimal obligations).

### CCPA Compliance (California)
- No personal information collected
- No sale of personal information
- No behavioral profiling
- Users can access/delete data easily

**LMAPP is CCPA compliant.**

### Other Jurisdictions
Similar privacy principles apply globally. If your region has specific requirements, we follow the strictest applicable standards.

---

## Transparency

### Source Code
LMAPP is open source (MIT License). You can:
- Review all code
- Verify no hidden data collection
- Audit privacy practices
- Contribute improvements

See [GitHub Repository](https://github.com/nabaznyl/lmapp)

### No Telemetry
Unlike many modern applications, LMAPP:
- Sends no telemetry
- Includes no tracking code
- Contains no analytics libraries
- Performs no phone-home behavior

---

## Changes to This Policy

### Notification
Changes to this privacy policy will be:
- Announced in release notes
- Updated here with effective date
- Notified to users (if contact available in future)

### Major Changes
For major changes affecting privacy:
- Advance notice (30 days minimum)
- Clear explanation of what changed
- How to opt-out or disable features

---

## Contact & Concerns

### Privacy Questions
- **GitHub Issues:** [Ask about privacy](https://github.com/nabaznyl/lmapp/issues)
- **Discussions:** [General questions](https://github.com/nabaznyl/lmapp/discussions)
- **Email:** [Contact - to be added]

### Report Privacy Issues
If you discover a privacy concern:
- **Security Issues:** See [SECURITY.md](SECURITY.md) for responsible disclosure
- **Policy Violations:** Open GitHub issue with details

---

## Acknowledgment

By using LMAPP, you acknowledge:
- You have read this privacy policy
- You understand what data is (and isn't) collected
- You accept the privacy practices described
- You consent to local storage of trial data

---

**This policy is effective for LMAPP v0.4.0 and later.**

**Previous versions may have different privacy practices (see release notes).**
