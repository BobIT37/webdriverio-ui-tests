Feature: DS-TS Welcome Features

    This feature provides Bobit.us Welcome features

    @welcome
    Scenario Outline: <TestID> : Bobit.us Home Page access and verifying Welcome! text
        Given I opened DS-TS web page
        Then I verified <text>
        
        Examples:
            | text          | TestID                   |
            | Welcome!      | bobit.us-WelcomePage_001 |
        
       
