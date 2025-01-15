"use client";

import { signUpAction } from "@/app/actions";
import { Form, Input, Button } from "@/utils/NextUI";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Signup() {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");
  const getPasswordError = (value: string) => {
    if (value.length < 8) {
      return "Votre mot de passe doit contenir au moins 8 caractères  ";
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return "Votre mot de passe doit contenir au moins 1 lettre majuscule";
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return "Votre mot de passe doit contenir au moins 1 symbole";
    }

    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Password validation
    const passwordError = getPasswordError(data.password as string);

    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    // Clear errors and submit
    setErrors({});
    setLoading(true);
    await signUpAction(new FormData(e.currentTarget));
    setLoading(false);
  };

  if (success) {
    return <div>Merci pour votre inscription ! Veuillez vérifier votre email vous avez reçu un lien de vérification.</div>;
  }

  return (
    <Form
      className="w-full justify-center items-center space-y-4"
      validationBehavior="native"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 max-w-lg">
        <div className="flex flex-row gap-4">
          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Veuillez entrer votre nom";
              }

              return errors.name;
            }}
            label="Nom"
            labelPlacement="outside"
            name="lastname"
            placeholder="Entrez votre nom"
          />
          <Input
            isRequired
            errorMessage={({ validationDetails }) => {
              if (validationDetails.valueMissing) {
                return "Veuillez entrer votre prénom";
              }

              return errors.firstname;
            }}
            label="Prénom"
            labelPlacement="outside"
            name="firstname"
            placeholder="Entrez votre prénom"
          />
        </div>
        <Input
          isRequired
          errorMessage={({ validationDetails }) => {
            if (validationDetails.valueMissing) {
              return "Veuillez entrer votre email";
            }
            if (validationDetails.typeMismatch) {
              return "Veuillez entrer un email valide";
            }
          }}
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Entrez votre email"
          type="email"
        />
        <Input
          isRequired
          errorMessage={getPasswordError(password)}
          isInvalid={getPasswordError(password) !== null}
          label="Mot de passe"
          labelPlacement="outside"
          name="password"
          placeholder="Entrez votre mot de passe"
          type="password"
          value={password}
          onValueChange={setPassword}
        />
        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit">
            S'inscrire
          </Button>
        </div>
        {error && <p>Une erreur est survenue lors de l'inscription</p>}
      </div>
    </Form>
  );
}

