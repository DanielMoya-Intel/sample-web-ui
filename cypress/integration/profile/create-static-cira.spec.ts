/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/
// Tests the creation of a profile
import { profileFixtures } from '../../fixtures/profile'
import { apiResponses, httpCodes } from '../../fixtures/api/apiResponses'

describe('Test Profile Page', () => {
  beforeEach('clear cache and login', () => {
    cy.setup()
    // Stub the get and post requests
    cy.myIntercept('GET', 'ciraconfigs?$count=true', {
      statusCode: apiResponses.ciraConfigs.getAll.forProfile.code,
      body: apiResponses.ciraConfigs.getAll.forProfile.response
    }).as('get-configs')

    cy.myIntercept('GET', 'wirelessconfigs?$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.wirelessConfigs.getAll.forProfile.response
    }).as('get-wirelessConfigs')

    cy.myIntercept('POST', 'profiles', {
      statusCode: httpCodes.CREATED,
      body: apiResponses.profiles.create.success.response
    }).as('post-profile')

    cy.myIntercept('GET', 'profiles?$top=25&$skip=0&$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.profiles.getAll.empty.response
    }).as('get-profiles')

    cy.goToPage('Profiles')
    cy.wait('@get-profiles')

    // change api response
    cy.myIntercept('GET', 'profiles?$top=25&$skip=0&$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.profiles.getAll.success.response
    }).as('get-profiles2')

    // Fill out the profile
    cy.get('button').contains('Add New').click()
    cy.wait('@get-configs')
    cy.wait('@get-wirelessConfigs')
  })

  it('creates the default profile with static+cira', () => {
  // Stub the get and post requests
    cy.myIntercept('GET', 'ciraconfigs?$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.ciraConfigs.getAll.forProfile.response
    }).as('get-configs')

    cy.myIntercept('GET', 'wirelessconfigs?$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.wirelessConfigs.getAll.forProfile.response
    }).as('get-wirelessConfigs')

    cy.myIntercept('POST', 'profiles', {
      statusCode: httpCodes.CREATED,
      body: apiResponses.profiles.create.success.response
    }).as('post-profile')

    cy.myIntercept('GET', 'profiles?$top=25&$skip=0&$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.profiles.getAll.empty.response
    }).as('get-profiles')

    cy.goToPage('Profiles')
    cy.wait('@get-profiles')

    // change api response
    cy.myIntercept('GET', 'profiles?$top=25&$skip=0&$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.profiles.getAll.success.response
    }).as('get-profiles2')

    // Fill out the profile
    cy.get('button').contains('Add New').click()
    cy.wait('@get-configs')
    cy.wait('@get-wirelessConfigs')
    cy.enterProfileInfo(
      profileFixtures.happyPathStaticCIRA.profileName,
      profileFixtures.happyPathStaticCIRA.activation,
      false,
      false,
      profileFixtures.happyPathStaticCIRA.dhcpEnabled,
      profileFixtures.happyPathStaticCIRA.connectionMode,
      profileFixtures.happyPathStaticCIRA.ciraConfig
    )
    cy.get('button[type=submit]').click()
    cy.get('button').contains('Continue').click()

    // Wait for requests to finish and check them their responses
    cy.wait('@post-profile').then((req) => {
      cy.wrap(req)
        .its('response.statusCode')
        .should('eq', httpCodes.CREATED)

      // Check that the config was successful
      cy.get('mat-cell').contains(profileFixtures.happyPathStaticCIRA.profileName)
      cy.get('mat-cell').contains(profileFixtures.check.network.static.toString())
      cy.get('mat-cell').contains(profileFixtures.check.mode.ccm)
    })

    // TODO: check the response to make sure that it is correct
    // this is currently difficult because of the format of the response
    cy.wait('@get-profiles2')
      .its('response.statusCode')
      .should('eq', httpCodes.SUCCESS)

    // Check that the config was successful
    cy.get('mat-cell').contains(profileFixtures.happyPathStaticCIRA.profileName)
    cy.get('mat-cell').contains(profileFixtures.check.network.static.toString())
    cy.get('mat-cell').contains(profileFixtures.check.mode.ccm)
  })

  it('creates the default profile with static+cira and random password', () => {
  // Stub the get and post requests
    cy.myIntercept('GET', 'ciraconfigs?$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.ciraConfigs.getAll.forProfile.response
    }).as('get-configs')

    cy.myIntercept('GET', 'wirelessconfigs?$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.wirelessConfigs.getAll.forProfile.response
    }).as('get-wirelessConfigs')

    cy.myIntercept('POST', 'profiles', {
      statusCode: httpCodes.CREATED,
      body: apiResponses.profiles.create.success.response
    }).as('post-profile')

    cy.myIntercept('GET', 'profiles?$top=25&$skip=0&$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.profiles.getAll.empty.response
    }).as('get-profiles')

    cy.goToPage('Profiles')
    cy.wait('@get-profiles')

    // change api response
    cy.myIntercept('GET', 'profiles?$top=25&$skip=0&$count=true', {
      statusCode: httpCodes.SUCCESS,
      body: apiResponses.profiles.getAll.success.response
    }).as('get-profiles2')

    // Fill out the profile
    cy.get('button').contains('Add New').click()
    cy.wait('@get-configs')
    cy.wait('@get-wirelessConfigs')
    cy.enterProfileInfo(
      profileFixtures.happyPathStaticCIRARandomPassword.profileName,
      profileFixtures.happyPathStaticCIRARandomPassword.activation,
      true,
      true,
      profileFixtures.happyPathStaticCIRARandomPassword.dhcpEnabled,
      profileFixtures.happyPathStaticCIRARandomPassword.connectionMode,
      profileFixtures.happyPathStaticCIRARandomPassword.ciraConfig
    )
    cy.get('button[type=submit]').click()
    cy.get('button').contains('Continue').click()
    cy.wait(300)
    cy.get('button').contains('Continue').click()

    // Wait for requests to finish and check them their responses
    cy.wait('@post-profile').then((req) => {
      cy.wrap(req)
        .its('response.statusCode')
        .should('eq', httpCodes.CREATED)

      // Check that the config was successful
      cy.get('mat-cell').contains(profileFixtures.happyPathStaticCIRARandomPassword.profileName)
      cy.get('mat-cell').contains(profileFixtures.check.network.static.toString())
      cy.get('mat-cell').contains(profileFixtures.check.mode.ccm)
    })

    // TODO: check the response to make sure that it is correct
    // this is currently difficult because of the format of the response
    cy.wait('@get-profiles2')
      .its('response.statusCode')
      .should('eq', httpCodes.SUCCESS)

    // Check that the config was successful
    cy.get('mat-cell').contains(profileFixtures.happyPathStaticCIRARandomPassword.profileName)
    cy.get('mat-cell').contains(profileFixtures.check.network.static.toString())
    cy.get('mat-cell').contains(profileFixtures.check.mode.ccm)
  })
})
