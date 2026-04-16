// Add this schema to your Sanity Studio project's schema list.
// In most Studio setups: import and add to the schemas array in sanity.config.js
// or schemaTypes array in schemas/index.js.

export default {
  name: 'prayerRequest',
  title: 'Prayer Request',
  type: 'document',
  fields: [
    {
      name: 'requesterName',
      title: 'Requester Name',
      type: 'string',
    },
    {
      name: 'prayerFor',
      title: 'Praying For',
      type: 'string',
      description: 'The name or cause being prayed for (shown publicly on the prayer wall)',
    },
    {
      name: 'message',
      title: 'Context / Message',
      type: 'text',
      description: 'Optional context provided by the requester (shown publicly when expanded)',
    },
    {
      name: 'emailHash',
      title: 'Email Hash',
      type: 'string',
      description: 'SHA-256 hash of the submitter email — used for rate limiting only, never displayed',
      readOnly: true,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Verification', value: 'pending_verification' },
          { title: 'Active', value: 'active' },
          { title: 'Expired', value: 'expired' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'flagCount',
      title: 'Flag Count',
      type: 'number',
      description: 'Community reports. Auto-rejected at 3 flags.',
      readOnly: true,
    },
    {
      name: 'verificationToken',
      title: 'Verification Token',
      type: 'string',
      description: 'One-time UUID sent in the confirmation email',
      readOnly: true,
    },
    {
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'verifiedAt',
      title: 'Verified At',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: '48 hours after verification',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'prayerFor',
      subtitle: 'status',
      description: 'flagCount',
    },
    prepare({ title, subtitle, description }) {
      const flagWarning = description >= 1 ? ` ⚑ ${description}` : ''
      return { title, subtitle: `${subtitle}${flagWarning}` }
    },
  },
  orderings: [
    {
      title: 'Submitted (newest first)',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Flag count (highest first)',
      name: 'flagCountDesc',
      by: [{ field: 'flagCount', direction: 'desc' }],
    },
  ],
}
