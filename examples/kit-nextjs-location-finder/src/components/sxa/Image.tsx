import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import React, { CSSProperties, type JSX } from 'react';

import type { SxaImageProps } from './sxa-image.props';

const ImageDefault = (props: SxaImageProps): JSX.Element => (
  <div className={`component image ${props.params.styles}`.trimEnd()}>
    <div className="component-content">
      <span className="is-empty-hint">Image</span>
    </div>
  </div>
);

export const Banner = (props: SxaImageProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = props;
  const { TargetUrl, Image } = props.fields;
  const isPageEditing = page.mode.isEditing;
  const classHeroBannerEmpty =
    isPageEditing && Image?.value?.class === 'scEmptyImage'
      ? 'hero-banner-empty'
      : '';
  const backgroundStyle = (Image?.value?.src && {
    backgroundImage: `url('${Image.value.src}')`,
  }) as CSSProperties;

  if (!Image) {
    return <ImageDefault {...props} />;
  }

  const modifyImageProps = {
    ...Image,
    value: {
      ...Image.value,
      style: { objectFit: 'cover', width: '100%', height: '100%' },
    },
  };

  return (
    <div
      className={`component hero-banner ${props.params.styles} ${classHeroBannerEmpty}`}
      id={id ? id : undefined}
    >
      <div
        className="component-content sc-sxa-image-hero-banner"
        style={backgroundStyle}
      >
        {isPageEditing || !TargetUrl?.value?.href ? (
          <ContentSdkImage
            field={modifyImageProps}
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <ContentSdkLink field={TargetUrl}>
            <ContentSdkImage field={Image} />
          </ContentSdkLink>
        )}
      </div>
    </div>
  );
};

export const Default = (props: SxaImageProps): JSX.Element => {
  const { page } = props;
  const { TargetUrl, Image: ImageField, ImageCaption } = props.fields;
  const isPageEditing = page.mode.isEditing;

  if (props.fields) {
    const Image = () => <ContentSdkImage field={ImageField} />;
    const id = props.params.RenderingIdentifier;

    return (
      <div
        className={`component image ${props.params.styles}`}
        id={id ? id : undefined}
      >
        <div className="component-content">
          {isPageEditing || !TargetUrl?.value?.href ? (
            <Image />
          ) : (
            <ContentSdkLink field={TargetUrl}>
              <Image />
            </ContentSdkLink>
          )}
          <Text
            tag="span"
            className="image-caption field-imagecaption"
            field={ImageCaption}
          />
        </div>
      </div>
    );
  }

  return <ImageDefault {...props} />;
};
