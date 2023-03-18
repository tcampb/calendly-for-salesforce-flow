import { api, LightningElement } from 'lwc'
import { FlowAttributeChangeEvent } from 'lightning/flowSupport'

const CalendlyEvent = {
  PROFILE_PAGE_VIEWED: 'calendly.profile_page_viewed',
  EVENT_TYPE_VIEWED: 'calendly.event_type_viewed',
  DATE_AND_TIME_SELECTED: 'calendly.date_and_time_selected',
  EVENT_SCHEDULED: 'calendly.event_scheduled',
}

export default class CalendlyInlineWidget extends LightningElement {
  isLoading = true
  _url
  _containerStyles

  @api calendlyLink
  @api containerStyles

  /* Output variables */
  @api eventScheduled
  @api eventUri
  @api inviteeUri

  /* Prefill */
  @api name
  @api email
  @api firstName
  @api lastName
  @api location
  @api guests
  @api customAnswer1
  @api customAnswer2
  @api customAnswer3
  @api customAnswer4
  @api customAnswer5
  @api customAnswer6
  @api customAnswer7
  @api customAnswer8
  @api customAnswer9
  @api customAnswer10

  /* Salesforce */
  @api salesforceUuid

  /* UTM */
  @api utmCampaign
  @api utmSource
  @api utmMedium
  @api utmContent
  @api utmTerm

  /* Page Settings */
  @api hideLandingPageDetails
  @api hideEventTypeDetails
  @api backgroundColor
  @api textColor
  @api primaryColor
  @api hideGdprBanner

  onCalendlyEvent(e) {
    const isCalendlyEvent = e.data.event && e.data.event.indexOf('calendly') === 0

    if (isCalendlyEvent) {
      const eventName = e.data.event
      if (eventName === CalendlyEvent.EVENT_SCHEDULED) {
        const { event, invitee } = e.data.payload
        this.dispatchEvent(new FlowAttributeChangeEvent('eventScheduled', true))
        this.dispatchEvent(new FlowAttributeChangeEvent('eventUri', event.uri))
        this.dispatchEvent(new FlowAttributeChangeEvent('inviteeUri', invitee.uri))
      }
    }
  }

  connectedCallback() {
    window.addEventListener('message', this.onCalendlyEvent.bind(this))
    const queryStringIndex = this.calendlyLink.indexOf('?')
    const hasQueryString = queryStringIndex > -1
    const queryString = this.calendlyLink.slice(queryStringIndex + 1)
    const baseUrl = hasQueryString ? this.calendlyLink.slice(0, queryStringIndex) : this.calendlyLink

    const updatedQueryString = [
      'embed_type=Inline',
      'embed_domain=1',
      hasQueryString ? queryString : null,
      this.backgroundColor ? `background_color=${this.backgroundColor.replace('#', '')}` : null,
      this.hideEventTypeDetails ? `hide_event_type_details=1` : null,
      this.hideLandingPageDetails ? `hide_landing_page_details=1` : null,
      this.primaryColor ? `primary_color=${this.primaryColor.replace('#', '')}` : null,
      this.textColor ? `text_color=${this.textColor.replace('#', '')}` : null,
      this.hideGdprBanner ? `hide_gdpr_banner=1` : null,
      this.utmCampaign ? `utm_campaign=${encodeURIComponent(this.utmCampaign)}` : null,
      this.utmContent ? `utm_content=${encodeURIComponent(this.utmContent)}` : null,
      this.utmMedium ? `utm_medium=${encodeURIComponent(this.utmMedium)}` : null,
      this.utmSource ? `utm_source=${encodeURIComponent(this.utmSource)}` : null,
      this.utmTerm ? `utm_term=${encodeURIComponent(this.utmTerm)}` : null,
      this.customAnswer1 ? `a1=${encodeURIComponent(this.customAnswer1)}` : null,
      this.customAnswer2 ? `a2=${encodeURIComponent(this.customAnswer2)}` : null,
      this.customAnswer3 ? `a3=${encodeURIComponent(this.customAnswer3)}` : null,
      this.customAnswer4 ? `a4=${encodeURIComponent(this.customAnswer4)}` : null,
      this.customAnswer5 ? `a5=${encodeURIComponent(this.customAnswer5)}` : null,
      this.customAnswer6 ? `a6=${encodeURIComponent(this.customAnswer6)}` : null,
      this.customAnswer7 ? `a7=${encodeURIComponent(this.customAnswer7)}` : null,
      this.customAnswer8 ? `a8=${encodeURIComponent(this.customAnswer8)}` : null,
      this.customAnswer9 ? `a9=${encodeURIComponent(this.customAnswer9)}` : null,
      this.customAnswer10 ? `a10=${encodeURIComponent(this.customAnswer10)}` : null,
      this.name ? `name=${encodeURIComponent(this.name)}` : null,
      this.email ? `email=${encodeURIComponent(this.email)}` : null,
      this.firstName ? `first_name=${encodeURIComponent(this.firstName)}` : null,
      this.lastName ? `last_name=${encodeURIComponent(this.lastName)}` : null,
      this.guests ? `guests=${this.formatGuests()}` : null,
      this.location ? `location=${encodeURIComponent(this.location)}` : null,
      this.salesforceUuid ? `salesforce_uuid=${encodeURIComponent(this.salesforceUuid)}` : null,
    ]
      .filter((item) => item !== null)
      .join('&')

    this._url = `${baseUrl}?${updatedQueryString}`
    this._containerStyles = this.containerStyles
  }

  formatGuests() {
    return this.guests.split(',').map((guest) => encodeURIComponent(guest)).join(',')
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.onCalendlyEvent.bind(this))
  }

  onLoad() {
    this.isLoading = false
  }
}
